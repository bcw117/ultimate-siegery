"use client";

import { useState } from "react";
import ChallengeSection from "@/components/custom/ChallengeSection";
import { challenges } from "@/lib/data/challenges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy } from "lucide-react";

export default function ChallengeView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-7xl mx-auto py-4 px-4 space-y-12">
      <section className="space-y-8">
        <div className="flex flex-col space-y-4">
          <div className="w-full pt-4">
            <ChallengeSection />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-blue-300" />
            Challenge Database
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChallenges.map((challenge, i) => (
            <Card
              key={i}
              className="flex flex-col h-full hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <Badge
                    variant="secondary"
                    className="mb-2 hover:bg-secondary/80"
                  >
                    {challenge.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                  {challenge.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {challenge.description}
                </p>
              </CardContent>
            </Card>
          ))}

          {filteredChallenges.length === 0 && (
            <div className="col-span-full text-center py-12 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                {`No challenges found matching "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
