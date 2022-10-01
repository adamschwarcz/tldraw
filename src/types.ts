import { TDUser } from "@tldraw/tldraw";

export interface UserPresence {
  id: string;
  tdUser: TDUser;
  cursor?: {
    x: number;
    y: number;
  };
  name: string;
  color: string;
}
