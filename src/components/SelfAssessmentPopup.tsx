"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/lib/i18n";

interface SelfAssessmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onGetRoutine?: () => void;
  locale: Locale;
}

const symptomOrder = ["vms", "sleep", "mood", "urogenital", "menstrual", "physical"] as const;
type SymptomKey = (typeof symptomOrder)[number];

type SymptomContent = {
  title: string;
  desc: string;
  items: string[];
};

const symptomCopy: Record<Locale, Record<SymptomKey, SymptomContent>> = {
  ko: {
    vms: {
      title: "혈관운동 증상 (VMS)",
      desc: "핵심 증상군으로 가장 흔함 - The Menopause Society",
      items: ["갑작스런 열감(홍조)", "밤에 땀을 흘리며 깨는 증상(야간 발한)", "열감/땀으로 수면 방해"],
    },
    sleep: {
      title: "수면",
      desc: "Mayo Clinic",
      items: ["잠들기 어렵거나 자주 깸", "아침 피로/개운치 않음"],
    },
    mood: {
      title: "기분·인지",
      desc: "nhs.uk",
      items: ["불안/초조", "기분 저하/무기력", "감정기복/예민함", "기억력·집중력 저하(브레인 포그)"],
    },
    urogenital: {
      title: "생식기·비뇨기·성건강",
      desc: "Mayo Clinic",
      items: ["질 건조/불편감", "성교 통증/성욕 저하", "잦은 소변·요절박/요로 불편"],
    },
    menstrual: {
      title: "월경 변화(퍼리/폐경 전환기)",
      desc: "ACOG",
      items: ["주기 불규칙/건너뜀", "양·기간 변화"],
    },
    physical: {
      title: "신체 전반",
      desc: "South Tees Hospitals NHS Trust",
      items: ["관절/근육 통증", "두통/심계항진(두근거림)", "체중 변화/복부 비만 경향", "피부·모발 변화/건조"],
    },
  },
  en: {
    vms: {
      title: "Vasomotor symptoms (VMS)",
      desc: "Core symptom cluster — The Menopause Society",
      items: ["Hot flashes", "Night sweats", "Sleep disrupted by heat or sweats"],
    },
    sleep: {
      title: "Sleep",
      desc: "Mayo Clinic",
      items: ["Difficulty falling or staying asleep", "Feeling unrefreshed in the morning"],
    },
    mood: {
      title: "Mood & cognition",
      desc: "nhs.uk",
      items: [
        "Anxiety or restlessness",
        "Low mood or loss of motivation",
        "Mood swings or irritability",
        "Memory or focus changes (brain fog)",
      ],
    },
    urogenital: {
      title: "Genitourinary & sexual health",
      desc: "Mayo Clinic",
      items: [
        "Vaginal dryness or discomfort",
        "Pain with intercourse or lower libido",
        "Frequent urination, urgency, or urinary discomfort",
      ],
    },
    menstrual: {
      title: "Cycle changes (peri/menopause transition)",
      desc: "ACOG",
      items: ["Irregular or skipped periods", "Changes in flow or duration"],
    },
    physical: {
      title: "Whole-body",
      desc: "South Tees Hospitals NHS Trust",
      items: [
        "Joint or muscle pain",
        "Headaches or palpitations",
        "Weight change or central adiposity",
        "Skin or hair changes/dryness",
      ],
    },
  },
};

const popupCopy = {
  ko: {
    title: "갱년기 증상 체크리스트 (2분 · 자가평가)",
    subtitle: "지난 2주를 기준으로 아래 증상의 빈도를 선택하세요.",
    legend: ["0: 전혀 없음", "1: 가끔", "2: 자주", "3: 거의 항상"],
    buttons: {
      prev: "이전",
      next: "다음",
      viewResults: "결과 보기",
      restart: "다시 평가",
      routine: "맞춤 루틴 받기",
      close: "닫기",
    },
    resultsTitle: "평가 결과",
    avgScoreLabel: (score: string) => `평균 점수: ${score}/3.0`,
    warningTitle: "⚠️ 의료 상담 필요",
    warningBody:
      "아래가 있으면 즉시 의료진과 상의하세요:\n• 이전과 다른 과다출혈/주기 사이 출혈, 성관계 후 출혈\n• 가슴 통증, 실신, 새로 시작된 심한 두통/신경학적 증상\n• 자살 생각 등 심각한 기분 저하",
    interpretation: {
      mild: { level: "경미", desc: "생활 루틴부터 시작" },
      moderate: { level: "중등", desc: "비약물·행동요법 + 필요 시 상담 권장" },
      severe: { level: "중증", desc: "의료진 상담/HRT·비호르몬 치료 검토 안내" },
    },
  },
  en: {
    title: "Menopause symptom checklist (2 min · self-assessment)",
    subtitle: "Based on the past two weeks, choose how often you notice each symptom.",
    legend: ["0: Not at all", "1: Occasionally", "2: Often", "3: Almost always"],
    buttons: {
      prev: "Back",
      next: "Next",
      viewResults: "View results",
      restart: "Restart assessment",
      routine: "Get personalized routine",
      close: "Close assessment",
    },
    resultsTitle: "Your result",
    avgScoreLabel: (score: string) => `Average score: ${score}/3.0`,
    warningTitle: "⚠️ When to seek medical care",
    warningBody:
      "Contact a clinician immediately if you notice:\n• New heavy bleeding, bleeding between periods, or after sex\n• Chest pain, fainting, or new severe headache/neurologic signs\n• Suicidal thoughts or severe mood decline",
    interpretation: {
      mild: { level: "Mild", desc: "Start with daily routines and lifestyle care." },
      moderate: { level: "Moderate", desc: "Combine non-pharmacologic care and consider speaking with a clinician." },
      severe: { level: "Severe", desc: "Consult a clinician and review HRT or non-hormonal therapies." },
    },
  },
} satisfies Record<Locale, {
  title: string;
  subtitle: string;
  legend: string[];
  buttons: { prev: string; next: string; viewResults: string; restart: string; routine: string; close: string };
  resultsTitle: string;
  avgScoreLabel: (score: string) => string;
  warningTitle: string;
  warningBody: string;
  interpretation: {
    mild: { level: string; desc: string };
    moderate: { level: string; desc: string };
    severe: { level: string; desc: string };
  };
}>;

const SelfAssessmentPopup: React.FC<SelfAssessmentPopupProps> = ({ isOpen, onClose, onGetRoutine, locale }) => {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const strings = popupCopy[locale] ?? popupCopy.ko;
  const symptoms = symptomCopy[locale] ?? symptomCopy.ko;
  const sections = symptomOrder;
  const currentSectionKey = sections[currentSection];

  const handleScoreChange = (itemKey: string, score: number) => {
    setScores({ ...scores, [itemKey]: score });
  };

  const calculateResults = () => {
    const categoryScores: Record<SymptomKey, number> = {
      vms: 0,
      sleep: 0,
      mood: 0,
      urogenital: 0,
      menstrual: 0,
      physical: 0,
    };
    let totalScore = 0;
    let itemCount = 0;

    symptomOrder.forEach((category) => {
      const data = symptoms[category];
      let categorySum = 0;
      let categoryCount = 0;

      data.items.forEach((item, index) => {
        const key = `${category}_${index}`;
        const score = scores[key] || 0;
        categorySum += score;
        categoryCount++;
        totalScore += score;
        itemCount++;
      });

      categoryScores[category] = categoryCount > 0 ? categorySum / categoryCount : 0;
    });

    const avgScore = itemCount > 0 ? totalScore / itemCount : 0;
    return { categoryScores, avgScore };
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const resetTest = () => {
    setScores({});
    setCurrentSection(0);
    setShowResults(false);
  };

  const getResultInterpretation = (score: number) => {
    const severity = score < 1.0 ? "mild" : score < 2.0 ? "moderate" : "severe";
    const copy = strings.interpretation[severity];
    const color = severity === "mild" ? "text-green-600" : severity === "moderate" ? "text-yellow-600" : "text-red-600";
    return { ...copy, color };
  };

  if (!isOpen) return null;

  const { categoryScores, avgScore } = calculateResults();
  const interpretation = getResultInterpretation(avgScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white relative">
        <Button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-gray-100"
          variant="ghost"
          size="icon"
          aria-label={strings.buttons.close}
        >
          <X className="h-5 w-5" />
        </Button>

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">
            {strings.title}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            {strings.subtitle}
          </p>
          <div className="flex gap-4 text-xs text-gray-500 mt-2">
            {strings.legend.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {!showResults ? (
            <>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-[#d65353] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                />
              </div>

              {/* Current section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {symptoms[currentSectionKey].title}
                  </h3>
                  <p className="text-xs text-gray-500">{symptoms[currentSectionKey].desc}</p>
                </div>

                <div className="space-y-4">
                  {symptoms[currentSectionKey].items.map((item, index) => {
                    const key = `${currentSectionKey}_${index}`;
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <p className="text-sm font-medium mb-3">{item}</p>
                        <div className="flex gap-3">
                          {[0, 1, 2, 3].map((score) => (
                            <label key={score} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={key}
                                value={score}
                                checked={scores[key] === score}
                                onChange={() => handleScoreChange(key, score)}
                                className="mr-2"
                              />
                              <span className="text-sm">{score}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    onClick={handlePrev}
                    disabled={currentSection === 0}
                    variant="outline"
                    className="rounded-xl"
                  >
                    {strings.buttons.prev}
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-[#d65353] hover:bg-[#d65353]/90 text-white rounded-xl"
                  >
                    {currentSection === sections.length - 1 ? strings.buttons.viewResults : strings.buttons.next}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Results */
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">{strings.resultsTitle}</h3>

                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2">
                    {strings.avgScoreLabel(avgScore.toFixed(1))}
                  </div>
                  <div className={`text-lg font-semibold ${interpretation.color}`}>
                    {interpretation.level}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {interpretation.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {symptomOrder.map((category) => {
                    const score = categoryScores[category];
                    return (
                      <div key={category} className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">{symptoms[category].title}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#d65353] h-2 rounded-full"
                              style={{ width: `${(score / 3) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{score.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-2">{strings.warningTitle}</p>
                <p className="text-xs text-red-700 whitespace-pre-line">{strings.warningBody}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={resetTest}
                  variant="outline"
                  className="rounded-xl flex-1"
                >
                  {strings.buttons.restart}
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    onGetRoutine?.();
                  }}
                  className="bg-[#d65353] hover:bg-[#d65353]/90 text-white rounded-xl flex-1"
                >
                  {strings.buttons.routine}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfAssessmentPopup;
