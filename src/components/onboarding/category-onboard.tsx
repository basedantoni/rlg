"use client";

import { Layers2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";

const CategoryOnboard = () => {
  const categories = [
    { icon: "biceps-flexed", title: "Fitness" },
    { icon: "graduation-cap", title: "Education" },
    { icon: "paintbrush-vertical", title: "Creative" },
    { icon: "heart-handshake", title: "Relationship" },
    { icon: "briefcase-business", title: "Career" },
    { icon: "feather", title: "Writing" },
    { icon: "hand-coins", title: "Finance" },
    { icon: "sun", title: "Spirtuality" },
  ];

  return (
    <Card className="overflow-hidden max-w-[400px] px-8 py-12 flex flex-col items-center gap-8">
      <div className="relative">
        {/* Blurs */}
        <div className="w-40 h-40 absolute -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        {/* Rings */}
        <div className="w-[108px] h-[108px] rounded-full border border-[#353535] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-[88px] h-[88px] rounded-full border border-[#353535] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-16 h-16 flex justify-center items-center rounded-full bg-foreground">
          <Layers2 size={32} className="stroke-background" />
        </div>
      </div>
      <p className="w-48 font-semibold text-center leading-5">
        Choose categories you want to focus on
      </p>
      <div className="grid grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card
            variant="selectable"
            gradient={true}
            className="w-24 h-24 px-3 py-4 gap-1 flex flex-col items-center justify-center"
            key={c.title}
          >
            <DynamicIcon name={c.icon} size={32} strokeWidth={1} />
            <p className="text-xs">{c.title}</p>
          </Card>
        ))}
      </div>
      <Button className="w-full">Submit</Button>
    </Card>
  );
};

export default CategoryOnboard;
