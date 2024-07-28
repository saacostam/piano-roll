import { v4 as uuidv4 } from 'uuid';

function getKeyStyling(note){
    if (note.length === 2 ){
        return 'background-color: var(--white); color: var(--black);'
    }
    return 'background-color: var(--black); color: var(--white);'
}

function createOscillator(freq, audioContext, attack, decay, type) {
    const audio = audioContext
    const gain = audio.createGain(),
        osc = audio.createOscillator();

    gain.connect(audio.destination);
    gain.gain.setValueAtTime(0, audio.currentTime);
    gain.gain.linearRampToValueAtTime(1, audio.currentTime + attack / 1000);
    gain.gain.setTargetAtTime(0.5, audio.currentTime + attack / 1000, audio.currentTime + decay / 1000);
    gain.gain.linearRampToValueAtTime(0, audio.currentTime + decay / 1000);

    osc.frequency.value = freq;
    osc.type = type;
    osc.connect(gain);
    osc.start(0);

    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(audio.destination);
    }, decay)
}

function getNotes(x){
    let index = sortedIndexForObjectId(this.inputs, x);
    let resp = []
    
    if (!this.inputs){return []};

    while (this.inputs[index] && this.inputs[index].start.x === x){
        resp.push({
            note: this.inputs[index].start.y,
            duration: this.inputs[index].end.x - this.inputs[index].start.x
        })

        index+=1;
    }
    return resp;
}

function eraseNote(id, event){
    event.preventDefault();
    for (let i=0; i<this.inputs.length; i++){
        if (this.inputs[i].id === id){
            this.inputs.splice(i, 1);
            return
        }
    }
}

function sortedIndexForObjectId(array, newX) {
    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid].start.x < newX) low = mid + 1;
        else high = mid;
    }
    return low;
}

function insert(element, array, index) {
    array.splice(index , 0, element);
    return array;
}

function addNote(event){
    const x = Number(event.srcElement.dataset.x);
    const y = Number(event.srcElement.dataset.y);

    const sortedIndex = sortedIndexForObjectId(this.inputs, x);

    insert({
        id: uuidv4(),
        start: {x, y},
        end:{x:x+this.lastDuration,y}
    }, this.inputs, sortedIndex);
}

function resizeNote(id, bUpdateStart, newX){
    let index = null;
    for (let i=0; i<this.inputs.length; i++){
        if (this.inputs[i].id === id){
            index = i;
            break
        }
    }
    
    if (index !== null){
        const newEntry = this.inputs[index];

        if (bUpdateStart) {
            if (newX <= newEntry.end.x){
                newEntry.start.x = newX;
            }else{return};
        }
        else { 
            if (newX >= newEntry.start.x){
                newEntry.end.x = newX;
            }else{return};
        }
        this.lastDuration = newEntry.end.x - newEntry.start.x;

        this.inputs.splice(index, 1);
        const sortedIndex = sortedIndexForObjectId(this.inputs, newEntry.start.x);
        insert(newEntry, this.inputs, sortedIndex);
    }
}

function moveNote(id, startX, startY){
    let index = null;
    for (let i=0; i<this.inputs.length; i++){
        if (this.inputs[i].id === id){
            index = i;
            break
        }
    }

    if (index !== null){
        const newEntry = this.inputs[index];

        this.lastDuration = newEntry.end.x - newEntry.start.x;
        newEntry.start.x = startX;
        newEntry.end.x = startX + this.lastDuration;
        newEntry.start.y = newEntry.end.y = startY;

        this.inputs.splice(index, 1);
        const sortedIndex = sortedIndexForObjectId(this.inputs, newEntry.start.x);
        insert(newEntry, this.inputs, sortedIndex);
    }
}

function handleDrop(e){
    const type = e.dataTransfer.getData("type");

    if (type == "resize"){
        const id = e.dataTransfer.getData("id");
        const direction = e.dataTransfer.getData("dir");
        this.resizeNote(id, direction === "left", Number(e.target.dataset.x))
    }else{
        const id = e.dataTransfer.getData("id");
        this.moveNote(id, Number(e.target.dataset.x), Number(e.target.dataset.y))
    }
}

export {getKeyStyling, createOscillator, getNotes, eraseNote, addNote, resizeNote, moveNote, handleDrop}