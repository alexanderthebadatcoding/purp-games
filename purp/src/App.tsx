import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sdk } from "@farcaster/miniapp-sdk";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  status: string;
  startDate: string;
  homeScore?: number;
  awayScore?: number;
  competitionName: string;
  description: string;
  awayWinner?: boolean;
  homeWinner?: boolean;
}

// Store picks/notes data (you can replace this with an API call or database)
const picksData: Record<string, Array<{ picker: string; pick: string }>> = {
  "401772635": [
    { picker: "@swim", pick: "Jacksonville over LAR ML (2.38)" },
    { picker: "@trizsamae", pick: "Jacksonville over LAR ML (2.38)" },
    { picker: "@ariabella", pick: "Jacksonville over LAR ML (2.38)" },
  ],
  "401772862": [
    { picker: "@qt", pick: "Minnesota over Philadelphia ML (2.08)" },
  ],
  "401772860": [
    { picker: "@purp", pick: "Carolina over New York Jets ML (1.86)" },
    { picker: "@ghostbo4.eth", pick: "Carolina over New York Jets ML (1.86)" },
    { picker: "@syskey", pick: "Carolina over New York Jets ML (1.86)" },
    { picker: "@todemashi", pick: "Carolina over New York Jets ML (1.86)" },
  ],
  "401772756": [
    { picker: "@gilbster", pick: "Colts over Chargers ML (2.10)" },
    { picker: "@pgilb", pick: "Colts over Chargers ML (2.10)" },
  ],
  "401772826": [
    { picker: "@augustuscaesar", pick: "Seattle over Texans ML (1.54)" },
    { picker: "@chikay", pick: "Seattle over Texans ML (1.54)" },
    { picker: "@degencummunist.eth", pick: "Seattle over Texans ML (1.54)" },
  ],
};

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(
          "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
        );
        const data = await res.json();

        const formattedGames: Game[] = (data.events || [])
          .map((event: any) => {
            try {
              const competition = event.competitions?.[0];
              if (!competition) return null;

              const homeTeam = competition.competitors?.[0];
              const awayTeam = competition.competitors?.[1];
              console.log("Home Team:", homeTeam);

              if (!homeTeam || !awayTeam) return null;

              return {
                id: event.id,
                homeTeam: homeTeam.team?.name || "Home",
                awayTeam: awayTeam.team?.name || "Away",
                homeTeamLogo: homeTeam.team?.logo || "",
                awayTeamLogo: awayTeam.team?.logo || "",
                status: competition.status?.type?.detail || "Scheduled",
                startDate: event.date || new Date().toISOString(),
                homeScore: homeTeam.score,
                awayScore: awayTeam.score,
                competitionName: event.name || "NFL Week 7",
                description: competition.status?.type?.description || "",
                awayWinner:
                  competition.status?.type?.detail === "Final" &&
                  awayTeam.winner,
                homeWinner:
                  competition.status?.type?.detail === "Final" &&
                  homeTeam.winner,
              };
            } catch (e) {
              return null;
            }
          })
          .filter(Boolean) as Game[];

        // setGames(formattedGames);
        const allowedIds = [
          "401772635",
          "401772862",
          "401772860",
          "401772756",
          "401772826",
          // "401772941",
        ];
        const filteredGames = formattedGames.filter((game) =>
          allowedIds.includes(game.id)
        );
        setGames(filteredGames);
      } catch (err: any) {
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen dark:bg-background text-foreground p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-900 dark:text-blue-100">
        🏈 The Purp Games 💸
      </h1>

      {loading && (
        <p className="text-center text-muted-foreground">Loading games...</p>
      )}
      {error && <p className="text-center text-destructive">Error: {error}</p>}
      {!loading && !error && games.length === 0 && (
        <p className="text-center text-muted-foreground">No games available.</p>
      )}

      <ScrollArea className="h-auto">
        <div className="grid gap-4 sm:max-w-3xl mx-auto">
          {games.map((game) => (
            <Card
              key={game.id}
              className="shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-indigo-950 border-blue-200 dark:border-indigo-900"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    {game.competitionName}
                  </CardTitle>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-background text-blue-900 dark:text-blue-100">
                    {game.description}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex w-full justify-around gap-4">
                  {/* Away Team */}
                  <div className="flex flex-col items-center justify-center w-1/2 p-4 bg-blue-50 dark:bg-background rounded-lg">
                    <img
                      src={game.awayTeamLogo}
                      alt={game.awayTeam}
                      className="w-12 h-12 mb-2 object-contain"
                    />
                    <div className="font-bold text-lg text-center">
                      {game.awayTeam} {game.awayWinner ? "🏆" : ""}
                    </div>
                    <div className="text-2xl font-bold text-white dark:text-white mt-1">
                      {game.awayScore ?? "-"}
                    </div>
                  </div>

                  {/* Home Team */}
                  <div className="flex flex-col items-center justify-center w-1/2 p-4 bg-blue-50 dark:bg-background rounded-lg">
                    <img
                      src={game.homeTeamLogo}
                      alt={game.homeTeam}
                      className="w-12 h-12 mb-2 object-contain"
                    />
                    <div className="font-bold text-lg text-center">
                      {game.homeTeam} {game.homeWinner ? "🏆" : ""}
                    </div>
                    <div className="text-2xl font-bold text-white dark:text-white mt-1">
                      {game.homeScore ?? ""}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-900">
                  <p className="text-xl font-semibold text-muted-foreground mb-2">
                    PICKS
                  </p>
                  {(() => {
                    const grouped = (picksData[game.id] || []).reduce(
                      (acc: Record<string, string[]>, pick) => {
                        if (!acc[pick.pick]) acc[pick.pick] = [];
                        acc[pick.pick].push(pick.picker);
                        return acc;
                      },
                      {}
                    );

                    return Object.entries(grouped).map(
                      ([pickName, pickers]) => (
                        <div key={pickName} className="text-md text-white mb-1">
                          <span className="font-semibold">{pickName}</span>{" "}
                          picked by{" "}
                          <span className="font-semibold">
                            {pickers.join(", ")}
                          </span>{" "}
                        </div>
                      )
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// After your app is fully loaded and ready to display
await sdk.actions.ready();
