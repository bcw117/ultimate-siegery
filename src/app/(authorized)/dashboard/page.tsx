"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Shield, Save } from "lucide-react";
import { Gadget, Operator, Weapon } from "@/lib/types/loadout";
import { toTitleCase } from "@/utils/helpers";
import { removeUnderscores } from "@/utils/helpers";
import { saveLoadout } from "./actions";
import { toast } from "sonner";

export default function Dashboard() {
  const [side, setSide] = useState<"A" | "D">("A");
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

  // Generate random loadout
  const generateLoadout = async () => {
    setIsGenerating(true);
    setShowResults(false);

    const response = await fetch(`/api/operator?side=${side}`);
    const loadout = await response.json();

    setSelectedOperator({
      id: loadout.id,
      name: loadout.name,
      side: loadout.side,
    } as Operator);
    setSelectedPrimary(loadout.primary_weapon);
    setSelectedSecondary(loadout.secondary_weapon);
    setSelectedGadget(loadout.gadget);
    setIsGenerating(false);
    setShowResults(true);
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
        operator: selectedOperator,
        pweapon: selectedPrimary,
        sweapon: selectedSecondary,
        gadget: selectedGadget,
      });

      console.log(result);

      if (result.success) {
        toast.success("Loadout saved successfully!");
      } else {
        toast.error("Failed to save loadout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred:" + (error as Error).message);
    }
  };

  return (
    <section
      id="demo"
      className="min-h-screen relative py-24 overflow-hidden w-full"
    >
      <div className="w-full relative z-10">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            <span className="text-siege-accent">Interactive</span> Loadout
            Generator
          </h2>
        </div>

        {/* Generator Card */}
        <div className="max-w-4xl mx-auto">
          <div className="siege-card">
            {/* Generator Controls */}
            <div className="mb-8">
              <Tabs defaultValue="operator" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-siege-dark/50">
                  <TabsTrigger
                    value="operator"
                    className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                  >
                    Single Operator
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                  >
                    Full Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="bans"
                    className="data-[state=active]:bg-siege-accent/20 data-[state=active]:text-siege-accent"
                  >
                    Ban Suggestions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="operator" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={side === "A" ? "default" : "outline"}
                        className={
                          side === "A"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
                        }
                        onClick={() => setSide("A")}
                      >
                        Attacker
                      </Button>
                      <Button
                        variant={side === "D" ? "default" : "outline"}
                        className={
                          side === "D"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
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
                  </div>
                </TabsContent>

                <TabsContent value="team" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={side === "A" ? "default" : "outline"}
                        className={
                          side === "A"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
                        }
                        onClick={() => setSide("A")}
                      >
                        Attacker
                      </Button>
                      <Button
                        variant={side === "D" ? "default" : "outline"}
                        className={
                          side === "D"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
                        }
                        onClick={() => setSide("D")}
                      >
                        Defender
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bans" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={side === "A" ? "default" : "outline"}
                        className={
                          side === "A"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
                        }
                        onClick={() => setSide("A")}
                      >
                        Attacker
                      </Button>
                      <Button
                        variant={side === "D" ? "default" : "outline"}
                        className={
                          side === "D"
                            ? "bg-siege-accent"
                            : "bg-transparent border-white/20 hover:border-white/50"
                        }
                        onClick={() => setSide("D")}
                      >
                        Defender
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Results Display */}
            {showResults && (
              <div className="rounded-lg bg-siege-dark/50 p-6 animate-fade-up">
                <h3 className="text-white text-xl font-medium mb-6 text-center">
                  Your Random Loadout
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">Operator</h4>
                    <p className="text-white text-lg font-semibold">
                      {selectedOperator?.name}
                    </p>
                    <div className="mt-1 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-siege-accent/20 text-siege-accent">
                      {selectedOperator?.side === "A" ? "Attacker" : "Defender"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">
                      Primary Weapon
                    </h4>
                    <p className="text-white text-lg font-semibold">
                      {removeUnderscores(selectedPrimary?.name ?? "")}
                    </p>
                  </div>

                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">
                      Secondary Weapon
                    </h4>
                    <p className="text-white text-lg font-semibold">
                      {removeUnderscores(selectedSecondary?.name ?? "")}
                    </p>
                  </div>

                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">Gadget</h4>
                    <p className="text-white text-lg font-semibold">
                      {toTitleCase(selectedGadget?.name ?? "")}
                    </p>
                  </div>
                </div>
              </div>
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
        </div>
      </div>
    </section>
  );
}
