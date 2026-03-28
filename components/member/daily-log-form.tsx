"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { alpha, useTheme } from "@mui/material/styles";
import { saveDailyLogSection } from "@/lib/actions/daily-log";
import type { DailyLogForEdit } from "@/lib/queries/daily-log";
import { QURAN_SURAH_PLACEHOLDER } from "@/lib/constants/daily-log";
import { QURAN_SURAH_OPTIONS } from "@/lib/constants/quran-surahs";
import { todayYmdLocal } from "@/lib/utils/date";
import { defaultSalahForGender } from "@/lib/utils/daily-log-defaults";
import { toast } from "sonner";
import {
  clearDailyLogDraft,
  readDailyLogDraftRaw,
  writeDailyLogDraftRaw,
} from "@/lib/utils/daily-log-draft";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const PRAYER_LABEL: Record<(typeof PRAYERS)[number], string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

type Gender = "MALE" | "FEMALE";

type FormState = DailyLogForEdit;

function defaultForm(g: Gender, dateYmd: string): FormState {
  return {
    date: dateYmd,
    salatSaved: false,
    quranSaved: false,
    hadithSaved: false,
    salah: defaultSalahForGender(g),
    quran: {
      quranType: "TILAWAT",
      quranSurah: QURAN_SURAH_PLACEHOLDER,
      quranPages: 1,
    },
    hadithLiterature: {
      hadithRead: false,
      literatureSkipped: false,
      bookTitle: "",
      bookDescription: "",
    },
  };
}

function labelForOpt(o: string) {
  if (o === "BA_JAMAAT") return "Ba jamaat";
  if (o === "MUNFARID") return "Munfarid";
  if (o === "ON_TIME") return "On time";
  return "Qaza";
}

function selectedSalahSx(theme: import("@mui/material").Theme, opt: string) {
  const common = {
    fontWeight: 600,
    borderWidth: 1,
  };
  switch (opt) {
    case "BA_JAMAAT":
      return {
        ...common,
        bgcolor: alpha(theme.palette.success.main, 0.2),
        color: theme.palette.mode === "dark" ? "#6EE7B7" : theme.palette.success.dark,
        borderColor: alpha(theme.palette.success.main, 0.55),
        "&:hover": {
          bgcolor: alpha(theme.palette.success.main, 0.28),
        },
      };
    case "MUNFARID":
      return {
        ...common,
        bgcolor: alpha(theme.palette.info.main, 0.22),
        color:
          theme.palette.mode === "dark"
            ? "#93C5FD"
            : theme.palette.info.dark ?? "#1D4ED8",
        borderColor: alpha(theme.palette.info.main, 0.45),
        "&:hover": {
          bgcolor: alpha(theme.palette.info.main, 0.3),
        },
      };
    case "QAZA":
      return {
        ...common,
        bgcolor: alpha(theme.palette.error.main, 0.18),
        color: theme.palette.mode === "dark" ? "#FCA5A5" : theme.palette.error.dark,
        borderColor: alpha(theme.palette.error.main, 0.45),
        "&:hover": {
          bgcolor: alpha(theme.palette.error.main, 0.26),
        },
      };
    case "ON_TIME":
      return {
        ...common,
        bgcolor: alpha(theme.palette.primary.main, 0.2),
        color: theme.palette.mode === "dark" ? "#FCD34D" : theme.palette.primary.dark,
        borderColor: alpha(theme.palette.primary.main, 0.45),
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.28),
        },
      };
    default:
      return {};
  }
}

export function DailyLogForm({
  genderUnit,
  initial,
  defaultDateYmd,
  userId,
}: {
  genderUnit: Gender;
  initial?: DailyLogForEdit | null;
  defaultDateYmd?: string;
  userId: string;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingSection, setPendingSection] = useState<
    "salah" | "quran" | "hadith" | null
  >(null);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const allowSaveDraft = useRef(false);
  const draftToastShown = useRef(false);

  const base = useMemo(() => {
    if (initial) return initial;
    const d = defaultForm(genderUnit, todayYmdLocal());
    if (defaultDateYmd && /^\d{4}-\d{2}-\d{2}$/.test(defaultDateYmd)) {
      d.date = defaultDateYmd;
    }
    return d;
  }, [initial, genderUnit, defaultDateYmd]);

  const [form, setForm] = useState<FormState>(base);
  const [surahInput, setSurahInput] = useState(() =>
    base.quran.quranSurah === QURAN_SURAH_PLACEHOLDER
      ? ""
      : base.quran.quranSurah,
  );

  useEffect(() => {
    setForm(base);
    setSurahInput(
      base.quran.quranSurah === QURAN_SURAH_PLACEHOLDER
        ? ""
        : base.quran.quranSurah,
    );
  }, [base]);

  const draftHydrateKey = useMemo(
    () =>
      [
        userId,
        base.date,
        genderUnit,
        initial?.date ?? "",
        initial?.salatSaved ? "1" : "0",
        initial?.quranSaved ? "1" : "0",
        initial?.hadithSaved ? "1" : "0",
      ].join("|"),
    [
      userId,
      base.date,
      genderUnit,
      initial?.date,
      initial?.salatSaved,
      initial?.quranSaved,
      initial?.hadithSaved,
    ],
  );

  useEffect(() => {
    if (initial) {
      allowSaveDraft.current = true;
      return;
    }
    const raw = readDailyLogDraftRaw(userId, base.date);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<FormState> & {
          contacts?: unknown;
        };
        if (parsed.date === base.date) {
          const d = defaultForm(genderUnit, base.date);
          const merged = {
            date: parsed.date ?? d.date,
            salatSaved: parsed.salatSaved ?? d.salatSaved,
            quranSaved: parsed.quranSaved ?? d.quranSaved,
            hadithSaved: parsed.hadithSaved ?? d.hadithSaved,
            salah: parsed.salah ?? d.salah,
            quran: parsed.quran ?? d.quran,
            hadithLiterature: parsed.hadithLiterature ?? d.hadithLiterature,
          };
          setForm(merged);
          setSurahInput(
            merged.quran.quranSurah === QURAN_SURAH_PLACEHOLDER
              ? ""
              : merged.quran.quranSurah,
          );
          if (!draftToastShown.current) {
            draftToastShown.current = true;
            toast.success("Draft loaded", { duration: 2500, id: "draft-once" });
          }
        }
      } catch {
        /* ignore */
      }
    }
    allowSaveDraft.current = true;
  }, [draftHydrateKey]);

  useEffect(() => {
    if (!allowSaveDraft.current) return;
    setDraftStatus("saving");
    const t = setTimeout(() => {
      try {
        writeDailyLogDraftRaw(userId, form.date, JSON.stringify(form));
        setLastSaved(new Date());
        setDraftStatus("saved");
      } catch {
        setDraftStatus("idle");
      }
    }, 550);
    return () => clearTimeout(t);
  }, [form, userId]);

  function onDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const ymd = e.target.value;
    draftToastShown.current = false;
    const raw = readDailyLogDraftRaw(userId, ymd);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        if (parsed.date === ymd) {
          const d = defaultForm(genderUnit, ymd);
          const merged = {
            date: parsed.date ?? ymd,
            salatSaved: parsed.salatSaved ?? d.salatSaved,
            quranSaved: parsed.quranSaved ?? d.quranSaved,
            hadithSaved: parsed.hadithSaved ?? d.hadithSaved,
            salah: parsed.salah ?? d.salah,
            quran: parsed.quran ?? d.quran,
            hadithLiterature: parsed.hadithLiterature ?? d.hadithLiterature,
          };
          setForm(merged);
          setSurahInput(
            merged.quran.quranSurah === QURAN_SURAH_PLACEHOLDER
              ? ""
              : merged.quran.quranSurah,
          );
          return;
        }
      } catch {
        /* fresh */
      }
    }
    const fresh = defaultForm(genderUnit, ymd);
    setForm(fresh);
    setSurahInput("");
  }

  function setSalah(p: (typeof PRAYERS)[number], v: string) {
    setForm((f) => ({
      ...f,
      salah: { ...f.salah, [p]: v },
    }));
  }

  function saveSection(section: "salah" | "quran" | "hadith") {
    setPendingSection(section);
    startTransition(async () => {
      const payload =
        section === "salah"
          ? { section, date: form.date, salah: form.salah }
          : section === "quran"
            ? { section, date: form.date, quran: form.quran }
            : {
                section,
                date: form.date,
                hadithLiterature: form.hadithLiterature,
              };

      const res = await saveDailyLogSection(payload);
      setPendingSection(null);
      if (res.error) {
        toast.error("Couldn’t save", { description: res.error });
        return;
      }
      const nextSalat = section === "salah" ? true : form.salatSaved;
      const nextQuran = section === "quran" ? true : form.quranSaved;
      const nextHadith = section === "hadith" ? true : form.hadithSaved;
      if (section === "salah") {
        setForm((f) => ({ ...f, salatSaved: true }));
      } else if (section === "quran") {
        setForm((f) => ({ ...f, quranSaved: true }));
      } else {
        setForm((f) => ({ ...f, hadithSaved: true }));
      }
      if (nextSalat && nextQuran && nextHadith) {
        clearDailyLogDraft(userId, form.date);
      }
      toast.success("Saved");
      router.refresh();
    });
  }

  const maleOpts = ["BA_JAMAAT", "MUNFARID", "QAZA"] as const;
  const femaleOpts = ["ON_TIME", "QAZA"] as const;
  const opts = genderUnit === "MALE" ? maleOpts : femaleOpts;

  const busy = (s: "salah" | "quran" | "hadith") =>
    pending && pendingSection === s;

  const draftLabel =
    draftStatus === "saving"
      ? "Saving draft…"
      : lastSaved
        ? `Draft · ${lastSaved.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
        : "Draft on device";

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            letterSpacing: "0.14em",
            display: "block",
            mb: 0.75,
          }}
        >
          Daily log
        </Typography>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Today&apos;s log
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.55 }}>
              Salah, Quran, and hadith — save each section when ready.
            </Typography>
          </Box>
          <TextField
            id="log-date"
            label="Date"
            type="date"
            value={form.date}
            onChange={onDateChange}
            required
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            inputProps={{ max: todayYmdLocal() }}
            sx={{ width: 158, flexShrink: 0 }}
          />
        </Stack>
      </Box>

      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={0.75}
          color="text.secondary"
          sx={{ mb: 1, minHeight: 22 }}
        >
          {draftStatus === "saving" ? (
            <CircularProgress size={14} />
          ) : (
            <CloudUploadIcon sx={{ fontSize: 16, flexShrink: 0 }} />
          )}
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, lineHeight: 1.35, fontSize: "0.75rem" }}
          >
            {draftLabel}
          </Typography>
        </Stack>
        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardHeader
            title="Prayers"
            titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
            action={
              form.salatSaved ? (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Synced"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              ) : null
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 2 }}>
            <Stack spacing={2.25}>
              {PRAYERS.map((p) => (
                <Box key={p}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
                  >
                    {PRAYER_LABEL[p]}
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    size="small"
                    value={form.salah[p]}
                    onChange={(_, v) => {
                      if (v != null) setSalah(p, v);
                    }}
                    sx={{ gap: 0.75, flexWrap: "wrap" }}
                  >
                    {opts.map((o) => (
                      <ToggleButton
                        key={o}
                        value={o}
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          textTransform: "none",
                          fontSize: "0.8125rem",
                          borderColor: "divider",
                          "&.Mui-selected": selectedSalahSx(theme, o),
                        }}
                      >
                        {labelForOpt(o)}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={busy("salah")}
                onClick={() => saveSection("salah")}
                startIcon={
                  busy("salah") ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
                sx={{ mt: 0.5, fontWeight: 600 }}
              >
                {busy("salah") ? "Saving…" : "Save prayers"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
        <CardHeader
          title="Quran"
          titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
          action={
            form.quranSaved ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Synced"
                color="success"
                size="small"
                variant="outlined"
              />
            ) : null
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 2 }}>
          <Stack spacing={2.25}>
            <FormControl fullWidth size="small">
              <InputLabel id="quran-type">Type</InputLabel>
              <Select
                labelId="quran-type"
                label="Type"
                value={form.quran.quranType}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    quran: {
                      ...f.quran,
                      quranType: e.target.value as FormState["quran"]["quranType"],
                    },
                  }))
                }
              >
                <MenuItem value="TILAWAT">Tilawat</MenuItem>
                <MenuItem value="TAFSEER">Tafseer</MenuItem>
                <MenuItem value="BOTH">Both</MenuItem>
              </Select>
            </FormControl>
            <Autocomplete
              freeSolo
              options={[...QURAN_SURAH_OPTIONS]}
              value={surahInput}
              onInputChange={(_, v) => {
                setSurahInput(v);
                setForm((f) => ({
                  ...f,
                  quran: {
                    ...f.quran,
                    quranSurah: v.trim() ? v : QURAN_SURAH_PLACEHOLDER,
                  },
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Surah"
                  placeholder="Search or type a surah"
                  fullWidth
                  size="small"
                />
              )}
            />
            <TextField
              label="Pages"
              type="number"
              inputProps={{ min: 1 }}
              value={form.quran.quranPages}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quran: {
                    ...f.quran,
                    quranPages: Number(e.target.value) || 1,
                  },
                }))
              }
              sx={{ maxWidth: 160 }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={busy("quran")}
              onClick={() => saveSection("quran")}
              startIcon={
                busy("quran") ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
              sx={{ fontWeight: 600 }}
            >
              {busy("quran") ? "Saving…" : "Save Quran"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
        <CardHeader
          title="Hadith & literature"
          titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
          action={
            form.hadithSaved ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="Synced"
                color="success"
                size="small"
                variant="outlined"
              />
            ) : null
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.hadithLiterature.hadithRead}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      hadithLiterature: {
                        ...f.hadithLiterature,
                        hadithRead: e.target.checked,
                      },
                    }))
                  }
                  color="primary"
                  size="medium"
                />
              }
              label={<Typography fontWeight={500}>Hadith read</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.hadithLiterature.literatureSkipped}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      hadithLiterature: {
                        ...f.hadithLiterature,
                        literatureSkipped: e.target.checked,
                      },
                    }))
                  }
                  color="primary"
                  size="medium"
                />
              }
              label={<Typography fontWeight={500}>No literature</Typography>}
            />
            {!form.hadithLiterature.literatureSkipped ? (
              <>
                <TextField
                  label="Book"
                  value={form.hadithLiterature.bookTitle}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      hadithLiterature: {
                        ...f.hadithLiterature,
                        bookTitle: e.target.value,
                      },
                    }))
                  }
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Summary (max 500)"
                  multiline
                  rows={3}
                  inputProps={{ maxLength: 500 }}
                  value={form.hadithLiterature.bookDescription}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      hadithLiterature: {
                        ...f.hadithLiterature,
                        bookDescription: e.target.value,
                      },
                    }))
                  }
                  fullWidth
                  size="small"
                />
              </>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={busy("hadith")}
              onClick={() => saveSection("hadith")}
              startIcon={
                busy("hadith") ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
              sx={{ fontWeight: 600 }}
            >
              {busy("hadith") ? "Saving…" : "Save hadith & literature"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
