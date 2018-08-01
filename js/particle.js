
//一、 获取canvas对象和画笔
var canvas=document.getElementById('particle')
var ctx=canvas.getContext('2d')

// 保存canvas的宽、高
var w = canvas.offsetWidth
var h = canvas.offsetHeight

// 注意：canvas实际有2套尺寸，一个是本身大小，另一个是绘图表面的大小，这里处理使它们大小一致，不然会出现拉伸情况
canvas.width=w
canvas.height=h

// 二、创建点的类
function Point(x,y){
	this.x=x;
	this.y=y;
	this.r=1 + Math.random()*2;
	this.sx=Math.random()*2-1;   //x轴速度
	this.sy=Math.random()*2-1;   //y轴速度
}

//生成随机颜色
// function makeColor(){

// 	var c1=Math.floor(Math.random()*255)
// 	var c2=Math.floor(Math.random()*255)
// 	var c3=Math.floor(Math.random()*255)
// 	var color=`rgba(${c1},${c2},${c3},1)`
// 	console.log('m',color)
// 	return color
// }

// 三、给Point添加画点的方法 
Point.prototype.draw = function(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = '#aaa'
    ctx.fill()
}

// 四、给Point添加点的动作

Point.prototype.move = function() {
    this.x += this.sx
    this.y += this.sy
    if(this.x > w || this.x < 0) this.sx = -this.sx
    if(this.y > h || this.y < 0) this.sy = -this.sy
}

// 五、点与点之间的连接 —— 画线

Point.prototype.drawLine = function(ctx, p) {
    var dx = this.x - p.x 
    var dy = this.y - p.y
    var d = Math.sqrt(dx * dx + dy * dy)
    if(d < 100) {
        var alpha = (100 - d) / 100 * 1 
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(p.x, p.y)
        ctx.closePath()
        ctx.strokeStyle = 'rgba(170, 170, 170, ' + alpha + ')'
        ctx.strokeWidth = 1
        ctx.stroke()
    }
}

// 六、实例化点/，并把每个点放在一个数组里面保存。

var points = []

for(var i = 0; i < 40; i++) {
    points.push(new Point(Math.random() * w, Math.random() * h))
}

// 七、画点

// 把放在points数组里面的点一个个拿出来，调用上面写好点的方法：画点（draw）、点会动（move）、点连线，最后调用 paint() 方法执行。

function paint() {
    ctx.clearRect(0, 0, w, h) //清空画布
    for(var i = 0; i < points.length; i++) {
        points[i].move() 
        points[i].draw(ctx)
        for(var j = i + 1; j < points.length; j++) {
            points[i].drawLine(ctx, points[j])
        }
    }
}
// 这里使用requestAnimationFrame更新画面
function loop() {
    requestAnimationFrame(loop)
    paint()
}
loop()

