import BackButton from "../common/BackButton";
import PageTitle from "../common/PageTitle";
import CreateTableForm from "./CreateTableForm";

export default function CreateTable() {
  return (
    <div className="mx-auto">
      <div className="flex items-center mb-4 relative">
        <BackButton destination="/" />
        <PageTitle title="Create Table" />
      </div>
      <CreateTableForm />
    </div>
  );
}
