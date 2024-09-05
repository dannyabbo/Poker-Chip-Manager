interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h2 className="text-xl font-bold w-full text-center">{title}</h2>;
}
