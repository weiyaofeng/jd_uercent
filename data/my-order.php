<?php
/**根据用户所提供的用户名，返回该用户的所有订单信息，以JSON格式**/
header('Content-Type: application/json');

$uname = $_REQUEST['uname'];//用户名
$pno = $_REQUEST['pno'];	//待显示的页号


//保存分页数据        
$output = [
	'record_count' => 0,	/*总记录数*/
	'page_size' => 5,		/*每页的记录数*/
	'page_count' => 0,		/*总页数*/
	'cur_page' => intval($pno),	/*当前页号*/
	'data' => []			/*当前页中的数据*/
];   


//根据用户名，查询订单表(jd_orders)
$conn = mysqli_connect('127.0.0.1','root','','jd',3306);
mysqli_query($conn, "SET NAMES UTF8");

////////////查询总记录数//////////////
$sql = "SELECT COUNT(order_id) FROM jd_orders WHERE user_name='$uname'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$output['record_count'] = intval($row['COUNT(order_id)']); //总记录数
$output['page_count'] = ceil($output['record_count']/$output['page_size']); //总页数


////////////分页查询需要的订单数据/////////////
$start = ($output['cur_page']-1)*$output['page_size']; //从哪条记录开始读取
$count = $output['page_size'];  //一次最多读取的记录数
$sql = "SELECT * FROM jd_orders WHERE user_name='$uname' LIMIT $start,$count";
$order_result = mysqli_query($conn,$sql);
while( ($order=mysqli_fetch_assoc($order_result))!==NULL ){
	$order['products'] = [];  //订单中的产品
	$oid = $order['order_id'];  //根据当前订单的编号查询出其对应的商品
	//$sql = "SELECT * FROM jd_products WHERE product_id IN (1,2,5)";
	$sql = "SELECT * FROM jd_products WHERE product_id IN ( SELECT product_id FROM jd_order_product_detail WHERE order_id='$oid' )";
	$product_result = mysqli_query($conn, $sql);
	while( ( $p = mysqli_fetch_assoc($product_result)) !== NULL ){
		$order['products'][] = $p;
	}

	$output['data'][] = $order;
}

echo json_encode($output);
?>