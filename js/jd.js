//load()          $.get()        $.post()   
//$.getScript()   $.getJSON()    $.ajax()

/**页面加载完成后，异步请求页头和页尾**/
$('.header').load('header.html');
$('.footer').load('footer.html');

/**为登录按钮绑定事件监听函数**/
$('#login-form [type="button"]').click(function(){
  var result = $('#login-form').serialize();
  $.post('data/login.php',result,function(data){
    //console.log('开始处理响应数据.....');
    //console.log(data);
    if(data.status<0){
      $('.modal .alert p').html(data.msg);
      $('[name="uname"]').val('');
      $('[name="upwd"]').val('');
    }else {
      $('#login-msg').html(data.msg+", 欢迎回来！");
      $('.modal').fadeOut();
      getMyOrder(data.msg, 1); //加载我的订单
    }
  });
});


/***附加导航的切换 ****/
$('[data-toggle="affix-item"]').click(function(event){
  event.preventDefault();
  $(this).parent().addClass('active')
    .siblings('.active').removeClass('active');

  var id = $(this).attr('href');
  $(id).addClass('active')
    .siblings('.active').removeClass('active');
});

/**异步请求登录用户的所有订单**/
function getMyOrder(uname, pno){
  $.get('data/my-order.php', {'uname':uname, 'pno':pno}, function(pagerObj){
    console.log('开始处理分页数据....');
    console.log(pagerObj);
    //根据分页对象修改数据表中的内容
    var str = '';  
    $.each(pagerObj.data, function(i, order){
      str += '<tr>'
					+'<td colspan="6" style="text-align: left">'
					+'		订单编号：'+order.order_num
	  			+'		<a href="'+order.shop_url+'">'+order.shop_name+'</a>'
					+'</td>'
					+'</tr>'
          +'<tr>'
					+'	<td style="text-align: left">';
          $.each(order.products, function(j,product){
            str += '<a href="'+product.product_url+'"><img src="'+product.product_img+'" alt="" title="'+product.product_name+'"></a>'; 
          })
			str +='</td>'
					+'	<td>'+order.user_name+'</td>'
					+'	<td>￥'+order.price+'<br>'+order.payment_mode+'</td>'
					+'	<td>'+order.submit_time.replace('T','<br>')+'</td>'
					+'	<td>'+order.order_state+'</td>'
					+'	<td>'
					+'		<a href="#">查看</a><br>'
					+'		<a href="#">确认收货</a><br>'
					+'		<a href="#">取消订单</a>'
					+'	</td>'
					+'</tr>';
    });
    $('#order-table tbody').html(str);

    //根据分页对象编写分页条
    var str = ''; 
    str += '<li><a href="#">'+(pagerObj.cur_page-2)+'</a></li>'
    str += '<li><a href="#">'+(pagerObj.cur_page-1)+'</a></li>'
    str += '<li class="active"><a href="#">'+pagerObj.cur_page+'</a></li>'
    str += '<li><a href="#">'+(pagerObj.cur_page+1)+'</a></li>'
    str += '<li><a href="#">'+(pagerObj.cur_page+2)+'</a></li>'
    $('.pager').html(str);
  });
}