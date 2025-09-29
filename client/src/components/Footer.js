export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-auto py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Case App. All rights reserved.
      </div>
    </footer>
  );
}
