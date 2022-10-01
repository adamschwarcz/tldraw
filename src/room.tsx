import { useOthers, useUpdatePresence } from "@y-presence/react";
import React from "react";
import { UserPresence } from "../types";
import { Cursor } from "./cursor";

export default function Room() {
  const others = useOthers<UserPresence>();
  const updatePresence = useUpdatePresence<UserPresence>();

  const handlePointMove = React.useCallback(
    (e: React.PointerEvent) => {
      updatePresence({
        cursor: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    },
    [updatePresence]
  );

  return (
    <div className="room" onPointerMove={handlePointMove}>
      <div className="info">Number of connected users: {others.length + 1}</div>

      {others.map((user) => {
        return <Cursor key={user.id} {...user.presence} />;
      })}
    </div>
  );
}
