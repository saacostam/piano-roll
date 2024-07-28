<template>
    <div class="note" :style="getNotePositioning()">
        <div class="start" @drag.prevent="resizeLeft" draggable="true" 
        @dragend.prevent="restartResizeState"
        @dragstart="setDragLeft">|</div>
        <div class="fill">
            <i class="bi bi-grip-vertical"
            @dragstart="setDrag" draggable="true"></i>
        </div>
        <div class="end" @drag.prevent="resizeRight" draggable="true" 
        @dragend.prevent="restartResizeState"
        @dragstart="setDragRight">|</div>
        <div class="note wrapper" v-if="dragLeft || dragRight" :style="getWrapperStyling()"></div>
    </div>
</template>

<script>
export default {
    props:['width', 'height', 'noteState', 'color'],
    data(){
        return {
            dragLeft: false,
            dragRight: false,
            event: 0,
            temp: {},
        }
    },
    methods:{
        getNotePositioning(){
            const input = this.noteState;
            if (this.dragLeft||this.dragRight){
                return `top:${input.start.y*this.height}rem; left:${input.start.x*this.width}rem;
                width: ${(input.end.x - input.start.x+1)*this.width}rem; height: ${this.height}rem;
                visibility:hidden; background-color: ${this.color};`
            }
            return `top:${input.start.y*this.height}rem; left:${input.start.x*this.width}rem;
            width: ${(input.end.x - input.start.x+1)*this.width}rem; height: ${this.height}rem;
            background-color: ${this.color};`
        },
        getWrapperStyling(){
            let startOffset = 0;
            let widthOffset = 0;
            const input = this.noteState;

            if (this.dragLeft){
                widthOffset = -this.event.offsetX/this.width/16;
                startOffset = this.event.offsetX/this.width/8;
            }else if (this.dragRight){
                widthOffset = this.event.offsetX/this.width/16;
            }

            return `top:0rem; left:${startOffset}rem;
            width: ${(input.end.x - input.start.x+1 + widthOffset)*this.width}rem; height: ${this.height}rem;
            visibility: visible;`
        },
        getEmptyImage() {
            const dragImg = new Image(0,0);
            dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            return dragImg;
        },
        setDragRight(e){
            e.dataTransfer.setDragImage(this.getEmptyImage(), 0, 0);
            e.dataTransfer.setData("id",this.noteState.id);
            e.dataTransfer.setData("type", "resize");
            e.dataTransfer.setData("dir", "right");
        },
        setDragLeft(e){
            e.dataTransfer.setDragImage(this.getEmptyImage(), 0, 0);
            e.dataTransfer.setData("id",this.noteState.id);
            e.dataTransfer.setData("type", "resize");
            e.dataTransfer.setData("dir", "left");
        },
        resizeLeft(e){
            this.dragLeft = true;
            this.event = e;
            this.temp = this.nodeState;
        },
        resizeRight(e){
            this.dragRight = true;
            this.event = e;
            this.temp = this.nodeState;
        },
        restartResizeState(e){
            this.dragRight = this.dragLeft = false;
        },
        setDrag(e){
            const image = new Image(0,0);
            image.src = 'svg/arrows-move.svg';
            e.dataTransfer.setDragImage( image , 8, 8);
            e.dataTransfer.setData("id",this.noteState.id);
        }
    }
}
</script>

<style lang="css" scoped>
.note{
    display: flex;
    position: absolute;
    box-sizing: border-box;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    border-radius: 0.5rem;
    pointer-events:none;
}
.start, .end{
    max-width: 8px;
    flex: 1 0 0;
    text-align: center;
    cursor:w-resize;
    user-select: none;
    background-color: inherit;
    filter: brightness(92%);
    border-radius: 0.5rem;
    pointer-events:all;
}
.fill{
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
}
.bi-grip-vertical{
    cursor:grab;
    pointer-events:all;
}
.bi-grip-vertical:drag{
    cursor:grabbing;
}
.wrapper{
    background-color: inherit;
    border-radius: 0.4rem;
    filter: brightness(110%);
    pointer-events: none;
    z-index: 10;
}
</style>