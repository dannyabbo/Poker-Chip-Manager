"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../common/BackButton";
import PageTitle from "../common/PageTitle";
import CreateTableForm from "./CreateTableForm";

export default function CreateTable() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="mx-auto">
      <div className="flex items-center mb-4 relative">
        <BackButton destination="/" />
        <PageTitle title="Create Table" />
      </div>
      <CreateTableForm  isSubmitting={isCreating} />
    </div>
  );
}
