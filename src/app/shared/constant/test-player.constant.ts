import {baseUrl} from "./index";
export const getAnswersByQuestionTestPlayerUrl: string = baseUrl + "SAnswer/getAnswersByQuestion";
export const checkSAnswerUrl: string = baseUrl + "SAnswer/checkAnswers";
export const getTimeStampUrl: string = baseUrl + "TestPlayer/getTimeStamp";
export const saveEndTimeUrl: string = baseUrl + "TestPlayer/saveEndTime";
export const getEndTimeUrl: string = baseUrl + "TestPlayer/getEndTime";
export const resetSessionDataUrl: string = baseUrl + "TestPlayer/resetSessionData";
export const getTestRecordUrl: string = baseUrl + "test/getRecords";
export const countTestPassesByStudentUrl: string = baseUrl + "Result/countTestPassesByStudent";
export const navButtonConstClassName: string = "btn nom-qua";
export const modalInfoParams: Object = {
    canDeactivateMessage: ["Ви дійсно хочете припинити тестування (ваші результати можуть бути втраченими)?",
        "confirm", "Попередження!"],
    youAsweredAllQuestion: [`Ви відповіли на всі запитання. Щоб закінчити тестування натисніть кнопку "Завершити тест"`,
        "info", "Повідомлення."],
    doYouWantFinishTest: ["Ви дійсно хочете завершити тестування?", "confirm", "Підтвердження."],
    mistakeDuringSaveResult: [`Виникла помилка в процесі збереження результатів. Нажміть "Завершити тест" повторно`,
        "info", "Результат тестування!"],
    youUsedAllAtempts: ["Ви використали всі спроби", "info", "Повідомлення."],
    impossibleRecoverTest: ["Відновлення тесту не можливо!", "info", "Повідомлення."]
}