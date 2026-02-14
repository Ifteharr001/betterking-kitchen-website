import Header from "./components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
     <Header />
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="h-16 border-t">Footer Placeholder</footer>
    </div>
  );
}