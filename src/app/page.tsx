import { Timer } from "@/components/timer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Time Tracker
          </h1>
          <Timer />
        </div>
      </main>
    </div>
  );
}
