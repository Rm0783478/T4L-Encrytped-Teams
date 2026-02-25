import React, { useMemo, useState } from "react";

type Chat = { id: string; name: string; last: string; unread?: number };
type Message = { id: string; from: "me" | "them"; text: string; time: string };

const ShieldMark = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2.5c3.5 2.2 6.7 2.6 8.5 2.7v6.7c0 5.2-3.7 9.3-8.5 10.6C7.2 21.2 3.5 17.1 3.5 11.9V5.2c1.8-.1 5-.5 8.5-2.7Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M9.2 12.2 11 14l3.8-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LockBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
    <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
    E2EE
  </span>
);

export default function EncryptedTeamsLayout() {
  const [activeChatId, setActiveChatId] = useState("c1");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");

  const chats: Chat[] = [
    { id: "c1", name: "Security Team", last: "Key rotation complete.", unread: 2 },
    { id: "c2", name: "Product", last: "Ship checklist is ready." },
    { id: "c3", name: "Design", last: "Updated icon set uploaded." },
    { id: "c4", name: "Ops", last: "Incident review at 3pm." },
  ];

  const messagesByChat: Record<string, Message[]> = {
    c1: [
      { id: "m1", from: "them", text: "We’ve enabled encrypted channels for this workspace.", time: "9:11" },
      { id: "m2", from: "me", text: "Great—are we enforcing verified devices?", time: "9:12" },
      { id: "m3", from: "them", text: "Yes. Key rotation complete.", time: "9:13" },
    ],
    c2: [
      { id: "m1", from: "them", text: "Ship checklist is ready.", time: "10:01" },
      { id: "m2", from: "me", text: "Awesome—send link in the secure channel.", time: "10:02" },
    ],
    c3: [
      { id: "m1", from: "them", text: "Updated icon set uploaded.", time: "11:08" },
    ],
    c4: [
      { id: "m1", from: "them", text: "Incident review at 3pm.", time: "12:40" },
    ],
  };

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];
  const activeMessages = messagesByChat[activeChat.id] ?? [];

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter((c) => c.name.toLowerCase().includes(q) || c.last.toLowerCase().includes(q));
  }, [query]);

  const send = () => {
    if (!draft.trim()) return;
    // UI-only demo: in a real app, you’d encrypt client-side and send ciphertext.
    alert(`(Demo) Would send encrypted message: "${draft.trim()}"`);
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl border bg-white p-2 shadow-sm">
              <ShieldMark />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">CipherTeams</span>
                <LockBadge />
              </div>
              <div className="text-xs text-neutral-500">
                Encrypted collaboration • Verified devices • Zero-trust
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50">
              New chat
            </button>
            <button className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50">
              Settings
            </button>
            <div className="ml-2 h-9 w-9 rounded-full border bg-white shadow-sm" title="Profile" />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 py-4">
        {/* Left rail */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chats"
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>

            <div className="max-h-[70vh] overflow-auto p-2">
              {filteredChats.map((c) => {
                const active = c.id === activeChatId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={[
                      "w-full rounded-xl p-3 text-left transition",
                      active ? "bg-neutral-100" : "hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">{c.name}</div>
                      {c.unread ? (
                        <span className="min-w-6 rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
                          {c.unread}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 line-clamp-1 text-xs text-neutral-500">{c.last}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security status card */}
          <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Security</div>
              <LockBadge />
            </div>
            <div className="mt-2 text-xs text-neutral-600">
              Messages are end-to-end encrypted. Keys live on verified devices only.
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border p-2">
                <div className="text-neutral-500">Device</div>
                <div className="font-medium">Verified</div>
              </div>
              <div className="rounded-xl border p-2">
                <div className="text-neutral-500">Key</div>
                <div className="font-medium">Rotated</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat pane */}
        <section className="col-span-12 md:col-span-6">
          <div className="flex h-[78vh] flex-col rounded-2xl border bg-white shadow-sm">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <div className="text-sm font-semibold">{activeChat.name}</div>
                <div className="text-xs text-neutral-500">Encrypted channel • Members: 12</div>
              </div>
              <button className="rounded-lg border bg-white px-3 py-2 text-sm hover:bg-neutral-50">
                Details
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto px-4 py-3">
              <div className="space-y-2">
                {activeMessages.map((m) => (
                  <div
                    key={m.id}
                    className={[
                      "flex",
                      m.from === "me" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "max-w-[75%] rounded-2xl border px-3 py-2 text-sm shadow-sm",
                        m.from === "me" ? "bg-neutral-900 text-white" : "bg-white",
                      ].join(" ")}
                    >
                      <div>{m.text}</div>
                      <div className="mt-1 text-[11px] opacity-70">{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Composer */}
            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message… (encrypted)"
                  className="min-h-[44px] w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
                />
                <button
                  onClick={send}
                  className="rounded-xl border bg-neutral-900 px-4 py-2 text-sm text-white shadow-sm hover:opacity-90"
                >
                  Send
                </button>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                Tip: In production, encrypt on-device, send ciphertext, and verify identities per session.
              </div>
            </div>
          </div>
        </section>

        {/* Right rail */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Workspace</div>
            <div className="mt-2 text-xs text-neutral-600">
              Quick actions + pinned files + meeting shortcuts live here.
            </div>

            <div className="mt-4 space-y-2">
              <button className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-neutral-50">
                🔒 Start secure meeting
              </button>
              <button className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-neutral-50">
                📎 Pinned files
              </button>
              <button className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-neutral-50">
                ✅ Tasks
              </button>
              <button className="w-full rounded-xl border px-3 py-2 text-left text-sm hover:bg-neutral-50">
                👥 Members
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Audit</div>
            <div className="mt-2 text-xs text-neutral-600">
              Show integrity checks, key verification, and session changes.
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded-xl border p-2">✓ Session verified</div>
              <div className="rounded-xl border p-2">✓ Keys match (3 devices)</div>
              <div className="rounded-xl border p-2">✓ No MITM detected</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}