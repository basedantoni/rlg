"use client";

import QuestForm from "@/components/quests/quest-form";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <Card className="w-[350px] px-6 py-4">
        <QuestForm />
      </Card>
    </>
  );
}
