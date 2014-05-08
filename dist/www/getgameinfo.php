<?php 

$getscore = $_GET["getscore"];


$json = file_get_contents('php://input');

$data = json_decode($json,true);

$name = $data["name"];
$emailaddress = $data["emailaddress"];
$score = $data["score"];

echo $name . $emailaddress . $score;

if($name && $emailaddress && $score){
	updateUser($name, $emailaddress, $score);

	header('Content-Type: application/json');


	$updateUser = array(status => 200);
	echo json_encode($updateUser);
}

if($getscore){
	getRanking();
}

function updateUser($username, $emailadd, $score){
	$conn = getConnection();

	mysql_query("INSERT INTO USERINFO (name, emailaddress, score) VALUES ('$username', '$emailadd', '$score')");

	closeConnection($conn);
}

function getRanking(){
	$conn = getConnection();

	$queryScoreBoard = "SELECT d.*, c.ranks FROM ( SELECT score, @rank:=@rank+1 Ranks FROM ( SELECT DISTINCT score FROM scoreboard.USERINFO a ORDER BY score DESC ) t, (SELECT @rank:= 0) r ) c INNER JOIN scoreboard.USERINFO d ON c.score = d.score ORDER BY RANKS ASC";

	$result = mysql_query($queryScoreBoard);
	
    if (mysql_num_rows($result) == 0) {
    	echo "No rows found";
    	exit;
	}

	$scoreboard = array();

	while($row = mysql_fetch_assoc($result)){
		array_push($scoreboard, array("ranks" => $row['ranks'], "name" => $row['name'], "emailaddress" => $row['emailaddress'], "score" => $row['score']));
	}

	header('Content-Type: application/json');

	echo json_encode($scoreboard);

	closeConnection($conn);
}

function getConnection(){
	$conn = mysql_connect("127.0.0.1","root","");
	mysql_select_db("scoreboard");

	return $conn;
}

function closeConnection($isconn){
	if($isconn){
        mysqli_close($isconn);
    }
}

?>