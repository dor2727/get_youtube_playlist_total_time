function assert(condition, message = "") {
  if (!condition) {
    console.error("Assertion Error: " + message);
  }
}

function get_element_by_id(possible_items, id_str) {
  for (let i = 0; i < possible_items.length; i++) {
    if (possible_items[i].id == id_str) {
      return possible_items[i];
    }
  }
}

function extract_videos() {
  const item_1 = document.querySelector("body");

  const possible_item_2 = item_1.getElementsByTagName("ytd-app");
  assert(possible_item_2.length == 1);
  const item_2 = possible_item_2[0];

  const possible_item_3 = item_2.getElementsByTagName("div");
  const item_3 = get_element_by_id(possible_item_3, "content");

  const possible_item_4 = item_3.getElementsByTagName("ytd-page-manager");
  const item_4 = get_element_by_id(possible_item_4, "page-manager");

  const possible_item_5 = item_4.getElementsByTagName("ytd-browse");
  assert(possible_item_5.length == 1);
  const item_5 = possible_item_5[0];
  assert(item_5.role == "main");

  const possible_item_6 = item_5.getElementsByTagName(
    "ytd-two-column-browse-results-renderer"
  );
  assert(possible_item_6.length == 1);
  const item_6 = possible_item_6[0];
  assert(item_6.pageSubtype == "playlist");

  const possible_item_7 = item_6.getElementsByTagName("div");
  const item_7 = get_element_by_id(possible_item_7, "primary");

  const videos = item_7.querySelectorAll("#time-status");
  assert(videos.length > 0);
  return videos;
}

function extract_expected_num_videos() {
  const possible_metadata_item_1 = document.querySelectorAll(".metadata-stats");
  assert(possible_metadata_item_1.length == 1);
  const metadata_item_1 = possible_metadata_item_1[0];

  const metadata_text = metadata_item_1.innerText;
  // extract regex "\d+ videos"
  const num_expected_videos = metadata_text.match(/\d+(?= videos)/)[0];
  return num_expected_videos;
}

function get_seconds_from_video(video) {
  const timeString = video.innerText.trim();
  const timeParts = timeString.split(":");
  const numParts = timeParts.map(Number); // Convert the parts to numbers

  if (numParts.length === 2) {
    // Format: "minute:seconds"
    return numParts[0] * 60 + numParts[1];
  } else if (numParts.length === 3) {
    // Format: "hour:minute:seconds"
    return numParts[0] * 3600 + numParts[1] * 60 + numParts[2];
  }
}

function print_seconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  console.log(`${hours}:${minutes}:${seconds}`);
}

function sum_seconds(extracted_videos) {
  totalSeconds = 0;
  for (let i = 0; i < extracted_videos.length; i++) {
    totalSeconds += get_seconds_from_video(extracted_videos[i]);
  }
  return totalSeconds;
}

function main() {
  // get videos
  const extracted_videos = extract_videos();

  // verify that we got all videos
  const num_extracted_videos = extracted_videos.length;
  const num_expected_videos = extract_expected_num_videos();
  assert(num_extracted_videos == parseInt(num_expected_videos));

  totalSeconds = sum_seconds(extracted_videos);
  print_seconds(totalSeconds);
}
