<?php
$mysqli = new mysqli("localhost", "fraggle_db", "l337crewdb", "fraggle_scroller");
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$scores = array();
$query = "SELECT * FROM highscores";

if ($result = $mysqli->query($query)) {
	while ($row = mysqli_fetch_array($result)) {
		$scores[] = $row[0];
	}
} else {
	$mysqli->query("INSERT INTO highscores VALUES (errorrrr)");
	//echo json_encode(array("topscores" => "error"));
	die();
}

$mysqli->query("TRUNCATE TABLE highscores");

array_push($scores, $_POST['playersHighScore']);
rsort($scores);
$scores = array_slice($scores, 0, 5);

for ($i = 0; $i < 5; $i++) {
	//$mysqli->query("INSERT INTO highscores VALUES hello");
	$mysqli->query("INSERT INTO highscores VALUES (" . $scores[$i]. ")");
}
?>