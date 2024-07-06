// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
const API_BASE_URL = "https://jservice.io/api/";

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  let response = await axios.get(`${API_BASE_URL}categories?count=100`);
  let categoryIds = _.sampleSize(response.data.map(c => c.id), NUM_CATEGORIES);
  return categoryIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let response = await axios.get(`${API_BASE_URL}category?id=${catId}`);
  let category = response.data;
  let clues = _.sampleSize(category.clues, NUM_QUESTIONS_PER_CAT).map(clue => ({
    question: clue.question,
    answer: clue.answer,
    showing: null
  }));
  return { title: category.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable() {
  const $jeopardy = $("#jeopardy");
  $jeopardy.empty();

  // Create header row with categories
  let $thead = $("<thead>");
  let $headerRow = $("<tr>");
  for (let cat of categories) {
    $headerRow.append($("<td>").text(cat.title));
  }
  $thead.append($headerRow);
  $jeopardy.append($thead);

  // Create body with questions
  let $tbody = $("<tbody>");
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    let $row = $("<tr>");
    for (let cat of categories) {
      $row.append($("<td>").text("?").data("category", cat).data("index", i));
    }
    $tbody.append($row);
  }
  $jeopardy.append($tbody);
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let $cell = $(evt.target);
  let category = $cell.data("category");
  let clueIndex = $cell.data("index");
  let clue = category.clues[clueIndex];

  if (clue.showing === null) {
    $cell.text(clue.question);
    clue.showing = "question";
  } else if (clue.showing === "question") {
    $cell.text(clue.answer);
    clue.showing = "answer";
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  // Add logic to show loading view (optional)
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  // Add logic to hide loading view (optional)
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  categories = [];
  let categoryIds = await getCategoryIds();

  for (let id of categoryIds) {
    categories.push(await getCategory(id));
  }

  fillTable();
}

/** On click of start / restart button, set up game. */

$(document).ready(function () {
  $("#jeopardy").on("click", "td", handleClick);
  $("#restart").on("click", setupAndStart);
  setupAndStart();
});
