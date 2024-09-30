import { HeaderDocsTop } from "@/feactures/docs/layout/HeaderDocsTop";
import tailwindClasses from "../../../../data";
import { ClassToRenderer } from "@/feactures/docs/layout/ClassToRederer";
import { dataVisibility, ObjectProperties } from "./dataOther";

export default function OtherPage() {
  return (
    <div className="flex flex-col gap-5">
      <HeaderDocsTop
        title="Visibility"
        Data={tailwindClasses.others.visibility}
        id="visibility"
      ></HeaderDocsTop>
      <ClassToRenderer list={dataVisibility}></ClassToRenderer>
      <HeaderDocsTop
        title="Object Properties"
        Data={tailwindClasses.others.objectProperties}
        id="objectProperties"
      ></HeaderDocsTop>
      <ClassToRenderer list={ObjectProperties}></ClassToRenderer>

    </div>
  );
}