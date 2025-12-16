"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/store";
import { QuestionRevealPage } from "@/components/questions/QuestionRevealPage";

export default function Step5() {
  const router = useRouter();
  const { set } = useQuiz();

  return (
    <QuestionRevealPage
      title="If we fixed that one thing, about how much would it be worth each month?"
      note="A rough guess is perfect—this just helps me right-size."
      answers={[
        { key: "250", label: "$0–$499" },
        { key: "1200", label: "$500–$1.9k" },
        { key: "3000", label: "$2k–$4.9k" },
        { key: "6000", label: "$5k+" },
      ]}
      onPick={(k) => {
        set("valuePerMonth", Number(k));
        router.push("/quiz/6");
      }}
    />
  );
}
