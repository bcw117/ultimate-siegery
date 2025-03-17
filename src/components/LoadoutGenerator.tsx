"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Shield, Save, ChevronRight } from "lucide-react";
import { GenerationType, Operator, Weapon, Gadget } from "@/assets/types";
import { getOperator } from "@/actions/operator";
import { getWeapons } from "@/actions/weapon";

// Mock data for demonstration
const attackers: Operator[] = [
  { name: "Ace", side: "A" },
  { name: "Ash", side: "A" },
  { name: "Thermite", side: "A" },
  { name: "Sledge", side: "A" },
  { name: "Thatcher", side: "A" },
];

const defenders: Operator[] = [
  { name: "Bandit", side: "D" },
  { name: "Caveira", side: "D" },
  { name: "Doc", side: "D" },
  { name: "Mute", side: "D" },
  { name: "Rook", side: "D" },
];

const primaryWeapons: Weapon[] = [
  { name: "AK-12", type: "Primary" },
  { name: "F2", type: "Primary" },
  { name: "M4", type: "Primary" },
  { name: "MP5", type: "Primary" },
  { name: "416-C", type: "Primary" },
];

const secondaryWeapons: Weapon[] = [
  { name: "P9", type: "Secondary" },
  { name: "5.7 USG", type: "Secondary" },
  { name: "P12", type: "Secondary" },
  { name: "PMM", type: "Secondary" },
  { name: "D-50", type: "Secondary" },
];

const gadgets: Gadget[] = [
  { name: "Frag Grenade" },
  { name: "Smoke Grenade" },
  { name: "Stun Grenade" },
  { name: "Breach Charge" },
  { name: "Claymore" },
];

const LoadoutGenerator: React.FC = () => {
  const [generationType, setGenerationType] =
    useState<GenerationType>("SingleOperator");
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

  // Function to randomly select items
  const getRandomItem = <T extends unknown>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  // Generate random loadout
  const generateLoadout = async () => {
    setIsGenerating(true);
    setShowResults(false);
    const operatorResults = await getOperator(side);
    if (!operatorResults) {
      return;
    }

    const weaponResults = await getWeapons(operatorResults.id);
    if (!weaponResults) {
      return;
    }
    console.log(weaponResults);

    setSelectedOperator({ name: operatorResults.name, side: operatorResults.side } as Operator);

    setIsGenerating(false);
    setShowResults(true);
  };

  return (
    <section
      id="demo"
      className="relative py-24 bg-siege-darker overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="noise-bg w-full h-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/5 rounded-full backdrop-blur-sm px-4 py-2 mb-4">
            <span className="text-white/70 text-sm font-medium">
              Try It Yourself
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            <span className="text-siege-accent">Interactive</span> Loadout
            Generator
          </h2>

          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Experience the core functionality of Ultimate Siegery with our demo
            loadout generator. Generate a random loadout for your next match.
          </p>
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
                        className="border-white/20 hover:border-white/50 text-white bg-transparent"
                        disabled={!showResults || isGenerating}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Loadout
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="mt-4">
                  <div className="text-center p-6 bg-siege-dark/30 rounded-lg border border-white/10">
                    <p className="text-white/70 mb-3">
                      Create an account to unlock full team randomization
                    </p>
                    <Button className="bg-siege-accent hover:bg-siege-accent/90">
                      Sign Up for Full Access
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="bans" className="mt-4">
                  <div className="text-center p-6 bg-siege-dark/30 rounded-lg border border-white/10">
                    <p className="text-white/70 mb-3">
                      Create an account to unlock ban suggestions
                    </p>
                    <Button className="bg-siege-accent hover:bg-siege-accent/90">
                      Sign Up for Full Access
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Button>
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
                      {selectedPrimary?.name}
                    </p>
                  </div>

                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">
                      Secondary Weapon
                    </h4>
                    <p className="text-white text-lg font-semibold">
                      {selectedSecondary?.name}
                    </p>
                  </div>

                  <div className="rounded-lg bg-siege-dark border border-white/10 p-5">
                    <h4 className="text-white/70 text-sm mb-2">Gadget</h4>
                    <p className="text-white text-lg font-semibold">
                      {selectedGadget?.name}
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

          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              This is a simplified demo. Create an account to access the full
              range of operators, weapons, and gadgets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoadoutGenerator;
