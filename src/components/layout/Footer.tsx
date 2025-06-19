export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Lyrical Pages. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with <span role="img" aria-label="love">❤️</span> for book enthusiasts.</p>
      </div>
    </footer>
  );
}
