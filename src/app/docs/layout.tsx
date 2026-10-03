import DocsSidebar from "@/components/docs/DocsSidebar";
import { Container } from "@/components/Section";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-8 sm:py-12 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <div className="mb-8 lg:mb-0">
        <DocsSidebar />
      </div>
      {children}
    </Container>
  );
}
