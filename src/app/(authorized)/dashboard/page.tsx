"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadoutSection from "@/components/dashboard/RandomizeLoadoutSection";
import ChallengeSection from "@/components/dashboard/ChallengeSection";
import CustomLoadoutSection from "@/components/dashboard/CustomLoadoutSection";

export default function Dashboard() {
  return (
    <section id="demo" className="min-h-screen relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Dashboard
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="siege-card">
            <Tabs defaultValue="custom" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-siege-dark/50">
                <TabsTrigger
                  value="custom"
                  className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                >
                  Operator
                </TabsTrigger>
                <TabsTrigger
                  value="operator"
                  className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                >
                  Random
                </TabsTrigger>
                <TabsTrigger
                  value="bans"
                  className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                >
                  Challenges
                </TabsTrigger>
              </TabsList>
              <TabsContent value="custom" className="mt-4">
                <CustomLoadoutSection />
              </TabsContent>
              <TabsContent value="operator" className="mt-4">
                <LoadoutSection />
              </TabsContent>

              <TabsContent value="bans" className="mt-4">
                <ChallengeSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
