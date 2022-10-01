import * as React from "react";
import {
  Renderer,
  TLKeyboardEventHandler,
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLWheelEventHandler,
} from "@tldraw/core";
import { useFileSystem } from "@tldraw/tldraw";
import { useStateDesigner } from "@state-designer/react";
import { roomID } from "./store";
import { shapeUtils } from "./shapes";
import { state, setBounds } from "./state/machine";
import { Toolbar } from "./components/toolbar";
import "./styles.css";
import styled from "stitches.config";
import Room from "./room";
import { awareness, provider } from "./store";
import { useEffect, useState } from "react";
import { USER_COLORS, USER_NAMES } from "./constants";
import { UserPresence } from "./types";

const onPointShape: TLPointerEventHandler = (info, e) => {
  state.send("POINTED_SHAPE", info);
};

const onPointCanvas: TLPointerEventHandler = (info, e) => {
  state.send("POINTED_CANVAS", info);
};

const onPointBounds: TLPointerEventHandler = (info, e) => {
  state.send("POINTED_BOUNDS", info);
};

const onPointerDown: TLPointerEventHandler = (info, e) => {
  state.send("STARTED_POINTING", info);
};

const onPointerUp: TLPointerEventHandler = (info, e) => {
  state.send("STOPPED_POINTING", info);
};

const onPointerMove: TLPointerEventHandler = (info, e) => {
  state.send("MOVED_POINTER", info);
};

const onPan: TLWheelEventHandler = (info, e) => {
  state.send("PANNED", info);
};

const onPinchStart: TLPinchEventHandler = (info, e) => {
  state.send("STARTED_PINCHING", info);
};

const onPinch: TLPinchEventHandler = (info, e) => {
  state.send("PINCHED", info);
};

const onPinchEnd: TLPinchEventHandler = (info, e) => {
  state.send("STOPPED_PINCHING", info);
};

const onPointBoundsHandle: TLPinchEventHandler = (info, e) => {
  state.send("POINTED_BOUNDS_HANDLE", info);
};

const onKeyDown: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "altKey":
    case "metaKey":
    case "ctrlKey":
    case "shiftKey": {
      state.send("TOGGLED_MODIFIER", info);
      break;
    }
    case "Backspace": {
      state.send("DELETED", info);
      break;
    }
    case "Escape": {
      state.send("CANCELLED", info);
      break;
    }
    case "0": {
      state.send("ZOOMED_TO_ACTUAL", info);
      break;
    }
    case "1": {
      state.send("ZOOMED_TO_FIT", info);
      break;
    }
    case "2": {
      state.send("ZOOMED_TO_SELECTION", info);
      break;
    }
    case "+": {
      state.send("ZOOMED_IN", info);
      break;
    }
    case "-": {
      state.send("ZOOMED_OUT", info);
      break;
    }
  }
};

const onKeyUp: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case "altKey":
    case "metaKey":
    case "ctrlKey":
    case "shiftKey": {
      state.send("TOGGLED_MODIFIER", info);
      break;
    }
  }
};

const random = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const name = random(USER_NAMES);
const color = random(USER_COLORS);

export default function App({ roomId }: { roomId: string }): JSX.Element {
  const appState = useStateDesigner(state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onSync = (isSynced: boolean) => {
      if (isSynced) {
        setLoading(false);
      }
    };

    provider.on("sync", onSync);

    return () => provider.off("sync", onSync);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <AppContainer>
      <RoomProvider<UserPresence>
        awareness={awareness}
        initialPresence={{ name: name, color: color }}
      >
        <div className="info">
          Number of connected users: {others.length + 1}
        </div>
        <Renderer
          shapeUtils={shapeUtils} // Required
          page={appState.data.page} // Required
          pageState={appState.data.pageState} // Required
          meta={appState.data.meta}
          onPointShape={onPointShape}
          onPointBounds={onPointBounds}
          onPointCanvas={onPointCanvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointBoundsHandle={onPointBoundsHandle}
          onPan={onPan}
          onPinchStart={onPinchStart}
          onPinchEnd={onPinchEnd}
          onPinch={onPinch}
          onPointerUp={onPointerUp}
          onBoundsChange={setBounds}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMount={onMount}
        />
        <Toolbar activeStates={state.active} lastEvent={state.log[0]} />
        <Room />
      </RoomProvider>
    </AppContainer>
  );
}

const AppContainer = styled("div", {
  position: "fixed",
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
  width: "100%",
  height: "100%",
});
