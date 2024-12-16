import { deleteSectionFromDB } from "../../repositories/section";
import { deleteSectionTasks } from "../../repositories/task";
import { executeTransaction } from "../../db";

export async function deleteSectionWithData(sectionId: number) {
  await executeTransaction(async (trx) => {
    await deleteSectionTasks(sectionId, trx);
    await deleteSectionFromDB(sectionId, trx);
  });
}
