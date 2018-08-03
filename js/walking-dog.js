
!function(){

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var w = canvas.width = window.innerWidth;
var h = canvas.height = 200

class DogAnimation{
	constructor(){
		// 存放加载后狗的图片
		this.dogPictures = []
		//图片目录
		this.RES_PATH = './imgs'
		this.IMG_COUNT = 8
		// 记录上一帧的时间
	    this.lastWalkingTime = Date.now(); 
	    // 记录当前画的图片索引
	    this.keyFrameIndex = -1; 
	    this.dog = {
	    	// 每步的像素
	    	stepDistance: 10,
	    	//小狗的速度
	    	dogSpeed: 0.15,
	    	//鼠标的X坐标
	    	mouseX: -1,
	    	// 往前走停留的位置
    		frontStopX: -1,
    		// 往回走停留的位置,
    		backStopX: window.innerWidth,
	    }

		this.start()
	}
	async start(){
		await this.loadResources()
		this.pictureWidth = this.dogPictures[0].naturalWidth / 2;
        // 小狗初始化的位置放在最右边
        // 小狗初始化的位置放在最右边
        this.dog.mouseX = window.innerWidth - this.pictureWidth;
        this.recordMousePosition();
		window.requestAnimationFrame(this.walk.bind(this));
	}
	loadResources(){
		let imagePath = []
		// 准备图片的src
		for(let i=0; i<= this.IMG_COUNT; i++){
			imagePath.push(`${this.RES_PATH}/${i}.png`)
		}
		let works = [];

		imagePath.forEach(imgPath=>{
			// 图片加载完之后触发Promise的resolve
			works.push(new Promise(resolve => {
				let img = new Image()
				img.onload = () =>resolve(img)
				img.src = imgPath
			}))
		})

		return new Promise(resolve => {
			// 借助Promise.all知道了所有图片都加载好了
			Promise.all(works).then(dogPictures =>{
				this.dogPictures = dogPictures;
				resolve();
			})
		}) ;  // 这里再套一个Promise是为了让调用者能够知道处理好了
	}

	walk(){
		// 绘制狗的图片，每过100ms就画一张 
		let now = Date.now();
		let distance = (now - this.lastWalkingTime) * this.dog.dogSpeed;
		if(distance < this.dog.stepDistance){
			window.requestAnimationFrame(this.walk.bind(this));
   			return;
		}
		// 获取下一张图片的索引
		let keyFrameIndex = ++this.keyFrameIndex % this.IMG_COUNT;
		let direct = -1, stopWalking = false;
		// 如果鼠标在狗的前面则往前走
		if(this.dog.frontStopX > this.dog.mouseX){
			direct = 1
		}
		// 如果鼠标在狗的后面则往回走
		else if(this.dog.backStopX < this.dog.mouseX){
			direct = -1
		}else{  // 如果鼠标在狗在位置
			stopWalking = true;
			// 初始化的时候小狗是反方向的，frontStopX为初始值-1
            // 说明鼠标还没动过
            // 如果鼠标在小狗图片中间的右边，则direct为正，否则为负
            direct = this.dog.frontStopX === -1 ? -1 :
                        this.dog.backStopX - this.dog.mouseX 
                            > this.pictureWidth / 2 ? 1 : -1;
            // 如果停住的话用0.png（后面还会加1）
            this.keyFrameIndex = -1;
            //this.dog.mouseX = this.dog.stopX;
		}
		// 先清掉上一次画的内容
	    ctx.clearRect(0, 0, w, h);
	    ctx.save();
	    if (!stopWalking) {
            this.dog.mouseX += this.dog.stepDistance * direct;
        }
        if (direct === -1) {
        	// 左右翻转绘制
            ctx.scale(direct, 1);
        }
	    let img = this.dogPictures[keyFrameIndex + 1]; 
	    let drawX = 0
	    // 左右翻转绘制的位置需要计算一下
	    drawX = this.dog.mouseX * direct - (direct === -1 ? this.pictureWidth : 0);
		                    // img, sx, sy, swidth, sheight
	    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,
		            // dx = 20, dy, dwidth, dheight
		            drawX, 20, 186, 162); 
	    ctx.restore();
	    this.lastWalkingTime = now;
		// 继续给下一帧注册一个函数
		window.requestAnimationFrame(this.walk.bind(this));
	}

	/// 记录鼠标位置
	recordMousePosition(){
		window.addEventListener('mousemove',event =>{
			// 如果没减掉图片的宽度，小狗就跑到鼠标后面去了，因为图片的宽度还要占去空间
			this.dog.frontStopX = event.clientX	- this.pictureWidth;
			this.dog.backStopX = event.clientX;
		})
		window.addEventListener("touchstart", event => {
            this.dog.frontStopX = event.touches[0].clientX - this.pictureWidth;
            this.dog.backStopX = event.touches[0].clientX;
        });
	}

}

var dog = new DogAnimation()
// dog.start()
}()