import Peer from "peerjs";
import type { DataConnection } from "peerjs";

export type PeerRole = "host" | "guest";

export type GameMessage =
  | { type: "startGame" }
  | { type: "guestReady" }
  | { type: "startInterview"; timestamp: number }
  | { type: "verdict"; verdict: "human" | "robot" }
  | { type: "playAgain"; roomCode: string };

type MessageHandler = (msg: GameMessage) => void;
type StatusHandler = (status: PeerStatus) => void;

export type PeerStatus =
  | "initializing"
  | "waiting_for_guest"
  | "connecting_to_host"
  | "connected"
  | "error"
  | "disconnected";

const PEER_PREFIX = "ic-";

export class GamePeer {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private onMessage: MessageHandler;
  private onStatus: StatusHandler;
  public role: PeerRole;
  public roomCode: string;

  constructor(
    role: PeerRole,
    roomCode: string,
    onMessage: MessageHandler,
    onStatus: StatusHandler
  ) {
    this.role = role;
    this.roomCode = roomCode;
    this.onMessage = onMessage;
    this.onStatus = onStatus;
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.onStatus("initializing");

      const peerId =
        this.role === "host" ? `${PEER_PREFIX}${this.roomCode}` : undefined;

      this.peer = new Peer(peerId ?? "", {
        debug: 0,
      });

      this.peer.on("open", () => {
        if (this.role === "host") {
          this.onStatus("waiting_for_guest");
          this.peer!.on("connection", (conn) => {
            this.conn = conn;
            this.setupConn(conn);
            this.onStatus("connected");
          });
          resolve();
        } else {
          // Guest: connect to host
          this.onStatus("connecting_to_host");
          const conn = this.peer!.connect(`${PEER_PREFIX}${this.roomCode}`, {
            reliable: true,
          });
          this.conn = conn;
          this.setupConn(conn);
          conn.on("open", () => {
            this.onStatus("connected");
            resolve();
          });
          conn.on("error", (err) => {
            reject(err);
          });
        }
      });

      this.peer.on("error", (err) => {
        this.onStatus("error");
        reject(err);
      });

      this.peer.on("disconnected", () => {
        this.onStatus("disconnected");
      });
    });
  }

  private setupConn(conn: DataConnection): void {
    conn.on("data", (data) => {
      this.onMessage(data as GameMessage);
    });
    conn.on("close", () => {
      this.onStatus("disconnected");
    });
    conn.on("error", () => {
      this.onStatus("error");
    });
  }

  send(msg: GameMessage): void {
    if (this.conn && this.conn.open) {
      this.conn.send(msg);
    }
  }

  destroy(): void {
    this.conn?.close();
    this.peer?.destroy();
    this.peer = null;
    this.conn = null;
  }
}
