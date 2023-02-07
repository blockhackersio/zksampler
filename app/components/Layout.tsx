import { ReactNode } from "react";
import { TwoColLayout } from "../ui/TwoColLayout";
import { TwoColLayoutCol } from "../ui/TwoColLayoutCol";
import Header from "./Header";

export function PageLayout(p: {
  subtitle: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <Header title={p.title} subtitle={p.subtitle} />
      <TwoColLayout>{p.children}</TwoColLayout>
    </div>
  );
}

export function Section(p: { children: ReactNode }) {
  return <TwoColLayoutCol>{p.children}</TwoColLayoutCol>;
}
