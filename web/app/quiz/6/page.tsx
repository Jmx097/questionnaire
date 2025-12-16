"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/store";
import { QuestionRevealPage } from "@/components/questions/QuestionRevealPage";

export default function Step6() {
  const router = useRouter();
  const { set } = useQuiz();

  return (
    <QuestionRevealPage
      title="How soon would you act if the right solution showed up?"
      answers={[
        { key: "asap", label: "ASAP" },
        { key: "30d", label: "Within 30 days" },
        { key: "quarter", label: "This quarter" },
        { key: "research", label: "Just researching" },
      ]}
      onPick={(k) => {
        set("urgency", k as any);
        router.push("/quiz/result");
      }}
    />
  );
}
