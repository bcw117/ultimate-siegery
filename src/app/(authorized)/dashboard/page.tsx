"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Shield, Save } from "lucide-react";
import { Gadget, Operator, Weapon } from "@/utils/types";
import { saveLoadout } from "./actions";
import { toast } from "sonner";
import LoadoutCard from "@/components/LoadoutCard";
import { challenges } from "@/data/challenges";

export default function Dashboard() {
  const [side, setSide] = useState<"A" | "D">("A");
  const [loadoutName, setLoadoutName] = useState("");
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null
  );
  const [selectedPrimary, setSelectedPrimary] = useState<Weapon | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<Weapon | null>(
    null
  );
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [randomChallenge, setRandomChallenge] = useState<{
    category: string;
    title: string;
    description: string;
  } | null>(null);

  const generateLoadout = async () => {
    setIsGenerating(true);
    setShowResults(false);

    try {
      const response = await fetch(`/api/operator?side=${side}`);
      const loadout = await response.json();

      setLoadoutName(loadout.name);
      setSelectedOperator(loadout.operator);
      setSelectedPrimary(loadout.primary_weapon);
      setSelectedSecondary(loadout.secondary_weapon);
      setSelectedGadget(loadout.gadget);
      setLoadoutName(loadout.name);
      setIsGenerating(false);
      setShowResults(true);

      console.log(loadout.gadget);
    } catch (e) {
      throw Error((e as Error).message);
    }
  };

  const handleSave = async () => {
    if (
      !selectedGadget ||
      !selectedOperator ||
      !selectedPrimary ||
      !selectedSecondary
    ) {
      toast.error("Please generate a loadout first");
      return;
    }

    try {
      const result = await saveLoadout({
        name: loadoutName,
        operator: selectedOperator,
        primary_weapon: selectedPrimary,
        secondary_weapon: selectedSecondary,
        gadget: selectedGadget,
      });

      if (result.success) {
        toast.success("Loadout saved successfully!");
      } else {
        toast.error("Failed to save loadout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred:" + (error as Error).message);
    }
  };

  const generateChallenge = () => {
    if (!challenges || challenges.length === 0) return;
    const idx = Math.floor(Math.random() * challenges.length);
    setRandomChallenge(challenges[idx]);
  };

  return (
    <section id="demo" className="min-h-screen relative overflow-hidden w-full">
      <div className="w-full relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            The Randomizer
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="siege-card">
            <Tabs defaultValue="operator" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-siege-dark/50">
                <TabsTrigger
                  value="operator"
                  className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                >
                  Operator
                </TabsTrigger>
                <TabsTrigger
                  value="bans"
                  className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                >
                  Challenges
                </TabsTrigger>
              </TabsList>

              <TabsContent value="operator" className="mt-4">
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={side === "A" ? "default" : "outline"}
                      className={
                        side === "A" ? "bg-siege-accent" : "bg-transparent"
                      }
                      onClick={() => setSide("A")}
                    >
                      Attacker
                    </Button>
                    <Button
                      variant={side === "D" ? "default" : "outline"}
                      className={
                        side === "D" ? "bg-siege-accent" : "bg-transparent "
                      }
                      onClick={() => setSide("D")}
                    >
                      Defender
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <Button
                      className="bg-siege-accent hover:bg-siege-accent/90 text-white flex items-center gap-2"
                      onClick={generateLoadout}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <span>Generating</span>
                          <span className="flex space-x-1 ml-1">
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                            <span className="loading-dot"></span>
                          </span>
                        </>
                      ) : (
                        <>
                          <Shuffle className="w-4 h-4" />
                          <span>Generate Random Loadout</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="border-white/20 hover:border-white/50 text-white bg-transparent cursor-pointer"
                      disabled={!showResults || isGenerating}
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Loadout
                    </Button>
                  </div>
                  {showResults && (
                    <LoadoutCard
                      name={loadoutName}
                      operator={selectedOperator}
                      primary={selectedPrimary}
                      secondary={selectedSecondary}
                      gadget={selectedGadget}
                    />
                  )}

                  {!showResults && !isGenerating && (
                    <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
                      <Shield className="mx-auto text-white/40 mb-4 w-12 h-12" />
                      <p className="text-white/70">
                        Click the Generate button to create your random loadout
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
                      <div className="flex justify-center mb-4">
                        <span className="flex space-x-2 items-center">
                          <span className="loading-dot w-3 h-3"></span>
                          <span className="loading-dot w-3 h-3"></span>
                          <span className="loading-dot w-3 h-3"></span>
                        </span>
                      </div>
                      <p className="text-white/70">
                        Randomizing your tactical loadout...
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bans" className="mt-4">
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                    <Button
                      className="bg-siege-accent hover:bg-siege-accent/90 text-white flex items-center gap-2"
                      onClick={generateChallenge}
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Generate Random Challenge</span>
                    </Button>
                  </div>

                  {randomChallenge ? (
                    <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-6 text-left">
                      <p className="text-sm text-siege-accent mb-1">
                        {randomChallenge.category}
                      </p>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {randomChallenge.title}
                      </h3>
                      <p className="text-white/80">
                        {randomChallenge.description}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-siege-dark/30 border border-white/10 p-10 text-center">
                      <Shield className="mx-auto text-white/40 mb-4 w-12 h-12" />
                      <p className="text-white/70">
                        Click the button to generate a random challenge
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
