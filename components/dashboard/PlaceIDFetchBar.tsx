import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

interface PlaceIDFetchBarProps {
  onFetch: (placeId: string) => void;
  isLoading: boolean;
}

export default function PlaceIDFetchBar({
  onFetch,
  isLoading,
}: PlaceIDFetchBarProps) {
  const [placeId, setPlaceId] = useState<string>("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onFetch(placeId);
    }
  };
  return (
    <Card className="p-4 sm:p-6 border border-border shadow-sm">
      <div className="flex flex-col gap-3">
        <label htmlFor="place-id" className="text-sm font-medium text-foreground">Lấy review từ Google Maps</label>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Input
              id="place-id"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary/50"
            />
            <Button
              onClick={() => onFetch(placeId)}
              disabled={isLoading}
              className="hover:bg-primary/90 max-w-40 mx-auto sm:mx-0"
            >
              {isLoading ? "Fetching..." : "Fetch Reviews"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Nhập ID của địa điểm google map muốn lấy review
          </p>
        </div>
      </div>
    </Card>
  );
}
