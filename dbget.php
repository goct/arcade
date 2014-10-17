<?php
$mysqli = new mysqli("localhost", "fraggle_db", "l337crewdb", "fraggle_scroller");
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}
/*
echo json_encode(array("lastId" => $_POST['lastId']));
die();
*/


$scores = array();
$query = "SELECT * FROM highscores";

if ($result = $mysqli->query($query)) {
	while ($row = mysqli_fetch_array($result)) {
		$scores[] = $row[0];
	}
} else {
	//echo json_encode(array("topscores" => "------------------------------------------------------------------"));
	die();
}

rsort($scores);
$top_five_scores = array_slice($scores, 0, 5);
echo json_encode(array("highScores" => $top_five_scores));
?>