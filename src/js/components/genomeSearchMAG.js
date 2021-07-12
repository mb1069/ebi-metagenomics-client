/**
 * Sourmash MAG search
 */
require("../commons");
require("mgnify-sourmash-component");
require("static/css/modules/genomes-sourmash.css");

// TODO: ⚠️ Improve the style of this view
const Backbone = require("backbone");
const queryString = require("query-string");

const SUBMIT_DISABLED_TEXT =
  "The Submit button is disablen until a fasta file is selected and a signature is generated";

const SECONDS_TO_CHECK = 5;

const STATUS_TYPE = {
  START: "START",
  SEARCHING: "SEARCHING",
  PENDING_JOB: "PENDING",
  RETRIEVED_JOB: "FINISH",
  URL_JOB: "Recovering...",
};

const getLinkToMagFromAccession = (accession) =>
  `<a href="https://www.ebi.ac.uk/metagenomics/genomes/${accession}">${accession}</a>`;

const getLinkToCSV = (url, filename) =>
  `<a download="${filename}.csv" href="${url}"><i class="icon icon-fileformats icon-CSV"></i></a>`;

/**
 * Genome Search MAG View.
 * This view contains the sourmash component and displays the results of a search job.
 */
module.exports = Backbone.View.extend({
  el: "#genome-search-mag",

  events: {
    // "sketched #sourmash": "sequenceSketched",
    // "sketchedError #sourmash": "sequenceSketchedError",
    "sketchedall #sourmash": "allSequencesSketched",
    "change #sourmash": "filesChanged",
    "click #search-button-mag": "submitJob",
    "click .clear-button-mag": "reset",
  },

  MSG_TYPE: {
    ERROR: "alert",
    SUCCESS: "success",
    WARNING: "warning",
  },

  initialize(settings) {
    this.API_URL = settings.api_url;

    this.$sourmash = this.$("#sourmash");
    this.$messageContainter = this.$("#message-containter-2");
    this.$submitButton = this.$("#search-button-mag");
    this.$searchSeccion = this.$("#search-mag-section");
    this.$resultsSeccion = this.$("#results-mag-section");
    this.$resultsDescription = this.$("#results-job-description");
    this.$timerLabel = this.$("#results-timer-label");
    this.$loading = this.$(".genome-search-mag-loading");

    this.jobID = this.getJobIDFromURL();
    this.status = this.jobID ? STATUS_TYPE.URL_JOB : STATUS_TYPE.START;

    this.$submitButton.attr("title", SUBMIT_DISABLED_TEXT);

    this.jobState = null;
    this.selectedFiles = null;
    this.signatures = null;
    this.timer = null;
    this.timerID = null;

    this.$loading.hide();
    this.refresh();
    if (this.status === STATUS_TYPE.URL_JOB) {
      this.jobState = {
        jobID: this.jobID,
      };
      this.startIntervalChecker();
    }
  },

  getJobIDFromURL() {
    const qs = queryString.extract(location.href);
    const urlParams = queryString.parse(qs, { arrayFormat: "bracket" });
    return urlParams.job_id;
  },

  /**
   * Triggered when thelist of selected files have changed
   * @param {Event} event The event.
   */
  filesChanged(event) {
    this.selectedFiles = event.detail.selectedFiles;
  },

  /**
   * Triggered when all the selected sequences have been analysed.
   * @param {Event} event The event.
   */
  allSequencesSketched(event) {
    this.signatures = event.detail.signatures;
    this.$submitButton.removeAttr("disabled");
    this.$submitButton.removeAttr("title");
    if (Object.keys(event.detail.errors || {}).length) {
      this.showMessage(
        "<p>We could'n process some of the files. If you press search now, those will be ignored.</pre>",
        this.MSG_TYPE.WARNING
      );
    }
  },

  /**
   * Resets all varaibles
   */
  reset() {
    this.jobID = null;
    this.status = STATUS_TYPE.START;
    this.jobState = null;
    this.selectedFiles = null;
    this.signatures = null;
    this.timer = null;
    this.timerID = null;

    this.$sourmash[0].clear();
    this.$submitButton.attr("disabled", "disabled");
    this.$submitButton.attr("title", SUBMIT_DISABLED_TEXT);
    this.refresh();
  },

  submitJob(event) {
    this.status = STATUS_TYPE.SEARCHING;
    this.refresh();
    const formdata = new FormData();
    formdata.append("mag_catalog", "HGUT");
    for (let [filename, signature] of Object.entries(this.signatures)) {
      formdata.append(
        "file_uploaded",
        new Blob([signature], {
          type: "text/plain",
        }),
        filename
      );
    }

    this.$loading.show();
    fetch(this.API_URL + "genomes-search/gather", {
      method: "POST",
      body: formdata,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(
          "Network response with problems. Status: " + response.status
        );
      })
      .then((result) => {
        this.status = STATUS_TYPE.PENDING_JOB;
        this.jobState = result.data;
        this.startIntervalChecker();
        console.log("Success:", result);
      })
      .catch((error) => {
        this.showMessage(
          "<p>There was a problem with the request</p><pre>" + error + "</pre>",
          this.MSG_TYPE.ERROR
        );
        this.status = STATUS_TYPE.START;
      })
      .finally(() => {
        this.$loading.hide();
        this.refresh();
      });
  },

  startIntervalChecker() {
    this.clearIntervalChecker();
    this.timerID = setInterval(() => this.checkStatus(), 1000);
  },
  clearIntervalChecker() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
    this.timer = 0;
  },
  checkStatus() {
    if (this.checking) return;
    if (this.timer > 0) {
      this.$timerLabel.html(`[Checking again in ${this.timer} seconds]`);
      this.timer--;
      return;
    }
    this.checking = true;
    this.timer = SECONDS_TO_CHECK;
    this.$timerLabel.html("[Checking...]");
    // if (this.controller) {
    //   this.controller.abort();
    // }
    this.$loading.show();
    // this.controller = new AbortController();
    fetch(this.API_URL + "genomes-search/status/" + this.jobID, {
      method: "GET",
      //   signal: this.controller.signal,
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(
          "Network response with problems. Status: " + response.status
        );
      })
      .then((result) => {
        this.jobState.job_id = result.data.group_id;
        this.jobState.results = result.data.signatures;
        this.status = this.jobState.results.some((s) =>
          ["PENDING", "IN_QUEUE", "RUNNING"].includes(s.status)
        )
          ? STATUS_TYPE.PENDING_JOB
          : STATUS_TYPE.RETRIEVED_JOB;
        if (this.status === STATUS_TYPE.RETRIEVED_JOB) {
          this.clearIntervalChecker();
          this.$timerLabel.html("");
        } else {
          this.timer = SECONDS_TO_CHECK;
        }
      })
      .catch((error) => {
        this.showMessage(
          "<p>There was a problem with the request</p><pre>" + error + "</pre>",
          this.MSG_TYPE.ERROR
        );
        this.status = STATUS_TYPE.START;
        this.clearIntervalChecker();
      })
      .finally(() => {
        this.$loading.hide();
        this.refresh();
        this.checking = false;
        // this.controller = null;
      });
  },

  /**
   * Show a meesage to the user.
   * @param {string} message the string message
   * @param {messageType} type the message type
   */
  showMessage(message, type) {
    this.$messageContainter.html(
      $(
        '<div class="callout ' +
          type +
          '" data-closable>' +
          message +
          '<button class="close-button" aria-label="Dismiss message"' +
          ' type="button" data-close>' +
          '<span aria-hidden="true">&times;</span>' +
          "</button>" +
          "</div>"
      )
    );
  },

  refreshJob() {
    if (!this.jobState) {
      this.$("#results-job-id").html("");
      this.$("#results-status").html("");
      this.$("#results-link").html("");
      this.$("#results-files").html("");
      return;
    }
    this.jobID = this.jobState.job_id;
    this.$("#results-job-id").html(this.jobID);
    this.$("#results-status").html(this.status);
    const tmpJobID = this.getJobIDFromURL();
    let url = null;
    if (!tmpJobID) {
      url = `${location.href}?job_id=${this.jobState.job_id}`;
    } else if (this.jobState.job_id === tmpJobID) {
      url = location.href;
    } else {
      url = location.href.replace(
        /job_id=.+/,
        `job_id=${this.jobState.job_id}`
      );
    }
    if (url) this.$("#results-link").html(`<a href="${url}">${url}</a>`);
    if (this.jobState.results) {
      this.$("#results-files").html(
        "<ul>" +
          this.jobState.results
            .map(
              (s) =>
                `<li><span class="filename">${
                  s.filename || s.job_id
                }</span> | ${
                  s.status === "SUCCESS"
                    ? `<span class="result-mag-match">${
                        s.result.p_query
                      } similarity with ${getLinkToMagFromAccession(
                        s.result.match
                      )}</span> | <span class="result-mag-csv">${getLinkToCSV(
                        s.results_url,
                        s.filename
                      )}</span>`
                    : s.status
                }
                ${
                  s.status === "IN_QUEUE"
                    ? ` : Position: ${s.position_in_queue}`
                    : ""
                }
                ${s.status === "FAILURE" ? `<pre>${s.reason}</pre>` : ""}
                </li>`
            )
            .join("") +
          "</ul>"
      );
    } else {
      this.$("#results-files").html(
        "<ul>" +
          (this.jobState.signatures_received || [])
            .map((s) => `<li><span class="filename">${s}</span></li>`)
            .join("") +
          "</ul>"
      );
    }
  },
  refresh() {
    this.refreshJob();
    this.$searchSeccion.hide();
    this.$resultsSeccion.hide();
    switch (this.status) {
      case STATUS_TYPE.START:
        this.$searchSeccion.show();
        break;
      case STATUS_TYPE.SEARCHING:
        this.$resultsDescription.html(`
            <p>✅ Your search was successfully submitted to our servers.</p>
            <p>This might take several minutes to be processed, depending on the size of your files and how busy are our servers.<br/>
                This page will show you the results once they are ready. No need to refresh. Or if you want, you can check later using the link below.</p>
        `);
        this.$searchSeccion.show();
        break;
      case STATUS_TYPE.PENDING_JOB:
      case STATUS_TYPE.URL_JOB:
        this.$resultsDescription.html(
          `<p>🔎 Getting the results of your Job</p>`
        );
        this.$resultsSeccion.show();
        break;
      case STATUS_TYPE.RETRIEVED_JOB:
        this.$resultsDescription.html(
          `<p>✅ Here are the results of your Job.</p>`
        );
        this.$resultsSeccion.show();
        break;
    }
  },
});
