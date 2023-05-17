const POINT_DIAMETER = 5;
const UI_HEIGHT = 30;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var masterUI = document.getElementById("masterUI");
var subUiArea = document.getElementById("subUiArea");
var pointCount = 0;
var variable = [];
var tag = [];
class ComplexNumber {
    constructor(id) {
        this.id = id;
        this.color = "#000";
        this.valid = true;
        this.realPart = 0;
        this.imaginaryPart = 0;

        this.numberUiUnit = document.createElement("div");
        this.numberUiUnit.className = "ui";
        Object.assign(this.numberUiUnit.style, {
            height: `${UI_HEIGHT}px`,
            width: "100%"
        });
        subUiArea.appendChild(this.numberUiUnit);
        
        //削除
        this.uiRemovePoint = document.createElement("div");
        this.uiRemovePoint.className = "ui";
        Object.assign(this.uiRemovePoint.style, {
            height: `${UI_HEIGHT-1}px`,
            aspectRatio: 1
        });
        this.uiRemovePoint.textContent = "-";
        this.uiRemovePoint.onpointerdown = () => {
            this.valid = false;
            this.numberUiUnit.remove();
        };
        this.numberUiUnit.appendChild(this.uiRemovePoint);

        //id&Tag表示
        this.idTagArea = document.createElement("div");
        this.idTagArea.className = "ui";
        Object.assign(this.idTagArea.style,{
            height: `${UI_HEIGHT-1}px`
        })
        this.idTagArea.textContent = `${this.id}/`;
        this.numberUiUnit.appendChild(this.idTagArea);

        //Tag入力
        this.uiTag = document.createElement("input");
        this.uiTag.className = "input";
        Object.assign(this.uiTag, {
            type: "text",
            value: "Tag",
        });
        this.uiTag.style = "width: 30px";
        this.uiTag.oninput = () => {
            tag[this.id] = `${this.uiTag.value}`;
            reloadCanvas();
        }
        this.idTagArea.appendChild(this.uiTag);

        //複素数入力
        this.valueArea = document.createElement("div");
        this.valueArea.className = "ui";
        Object.assign(this.valueArea.style,{
            height: `${UI_HEIGHT-1}px`
        });
        this.numberUiUnit.appendChild(this.valueArea);

        //実部入力
        this.uiRealPartArea = document.createElement("input");
        this.uiRealPartArea.className = "input";
        Object.assign(this.uiRealPartArea,{
            type: "number",
            value: 0
        });
        this.uiRealPartArea.style = "width: 50px";
        this.uiRealPartArea.oninput = () => {
            this.realPart = this.uiRealPartArea.value;
            reloadCanvas();
        }
        this.valueArea.appendChild(this.uiRealPartArea);

        //＋表示
        this.uiPulus = document.createElement("div");
        this.uiPulus.className = "input";
        this.uiPulus.style = "width: 20px";
        this.uiPulus.textContent = "+";
        this.valueArea.appendChild(this.uiPulus);

        //虚部入力
        this.uiImaginaryPartArea = document.createElement("input");
        this.uiImaginaryPartArea.className = "input";
        Object.assign(this.uiImaginaryPartArea,{
            type: "number",
            value: 0
        });
        this.uiImaginaryPartArea.style = "width: 50px";
        this.uiImaginaryPartArea.oninput = () => {
            this.imaginaryPart = this.uiImaginaryPartArea.value;
            reloadCanvas();
        }
        this.valueArea.appendChild(this.uiImaginaryPartArea);

        //虚数単位表示
        this.imaginaryNumber = document.createElement("div");
        this.imaginaryNumber.className = "input";
        this.imaginaryNumber.style = "width: 20px";
        this.imaginaryNumber.textContent = "i ";
        this.valueArea.appendChild(this.imaginaryNumber);

        //計算on/off
        this.computeValid = document.createElement("input");
        this.computeValid.className = "ui";
        this.computeValid.type = "checkbox";
        this.computeValid.checked = false;
        this.computeValid.style.height = `${UI_HEIGHT-1}px`;
        this.numberUiUnit.appendChild(this.computeValid);

        //計算内容枠
        this.formula = document.createElement("div");
        this.formula.className = "ui";
        this.formula.style.height = `${UI_HEIGHT-1}px`;
        this.numberUiUnit.appendChild(this.formula);

        //被演算子1
        this.operand1 = document.createElement("input");
        Object.assign(this.operand1,{
            classname: "input",
            type: "number",
            value: 0,
            min: 0,
            max: this.id-1
        });
        this.operand1.style.width = "50px";
        this.formula.appendChild(this.operand1);
        
        //演算子
        this.operator = document.createElement("select");
        this.operator.className = "input";

        this.option0 = document.createElement("option");
        this.option0.value = 0;
        this.option0.textContent = "+";
        this.operator.appendChild(this.option0);

        this.option1 = document.createElement("option");
        this.option1.value = 1;
        this.option1.textContent = "-";
        this.operator.appendChild(this.option1);

        this.option2 = document.createElement("option");
        this.option2.value = 2;
        this.option2.textContent = "×";
        this.operator.appendChild(this.option2);

        this.option3 = document.createElement("option");
        this.option3.value = 3;
        this.option3.textContent = "÷";
        this.operator.appendChild(this.option3);

        this.formula.appendChild(this.operator);

        //被演算子2
        this.operand2 = document.createElement("input");
        Object.assign(this.operand2,{
            classname: "input",
            type: "number",
            value: 0,
            min: 0,
            max: this.id-1
        });
        this.operand2.style.width = "50px";
        this.formula.appendChild(this.operand2);

    }
    inputRealPart(value) {
        this.realPart = value;
        this.uiRealPartArea.value = value;
    }
    inputImaginaryPart(value) {
        this.imaginaryPart = value;
        this.uiImaginaryPartArea.value = value;
    }
    outputRealPart() {
        return this.realPart;
    }
    outputImaginaryPart() {
        return this.imaginaryPart;
    }
    outputFormula(){
        return [this.computeValid.checked, parseInt(this.operator.value), parseInt(this.operand1.value), parseInt(this.operand2.value)];
    }
    drawPoint() {
        if(this.valid){
            ctx.beginPath();
            ctx.fillStyle = "#000";
            ctx.arc(canvas.width * 0.5 + parseFloat(this.realPart),canvas.height * 0.5 - this.imaginaryPart,POINT_DIAMETER * 0.5,0,2 * Math.PI,false);
            ctx.fill();
        }
    }
}

class mainUI {
    constructor(){
        Object.assign(masterUI.style,{height: `${UI_HEIGHT}px`});
        this.uiAddPoint = document.createElement("div");
        this.uiAddPoint.className = "ui";
        Object.assign(this.uiAddPoint.style, {
            height: `${UI_HEIGHT-1}px`,
            aspectRatio: 1
        });
        this.uiAddPoint.textContent = "+";
        masterUI.appendChild(this.uiAddPoint);
        this.uiAddPoint.onpointerdown = () => {
            pointCount ++;
            variable[pointCount-1] = new ComplexNumber(pointCount-1);
            reloadCanvas();
        };
    }
}

function compute(selector) {
    formula = variable[selector].outputFormula();
    if(formula[0]){
        switch(formula[1]) {
            case 0:
                variable[selector].inputRealPart(parseFloat(variable[formula[2]].outputRealPart()) + parseFloat(variable[formula[3]].outputRealPart()));
                variable[selector].inputImaginaryPart(parseFloat(variable[formula[2]].outputImaginaryPart()) + parseFloat(variable[formula[3]].outputImaginaryPart()));
            break;

            case 1:
                variable[selector].inputRealPart(variable[formula[2]].outputRealPart() - variable[formula[3]].outputRealPart());
                variable[selector].inputImaginaryPart(variable[formula[2]].outputImaginaryPart() - variable[formula[3]].outputImaginaryPart());
            break;
                
            case 2:
                variable[selector].inputRealPart(variable[formula[2]].outputRealPart() * variable[formula[3]].outputRealPart() - variable[formula[2]].outputImaginaryPart() * variable[formula[3]].outputImaginaryPart());
                variable[selector].inputImaginaryPart(variable[formula[2]].outputRealPart() * variable[formula[3]].outputImaginaryPart() + variable[formula[3]].outputRealPart() * variable[formula[2]].outputImaginaryPart());
            break;
            
            case 3:
                variable[selector].inputRealPart((variable[formula[2]].outputRealPart() * variable[formula[3]].outputRealPart() + variable[formula[2]].outputImaginaryPart() * variable[formula[3]].outputImaginaryPart()) / (variable[formula[3]].outputRealPart() * variable[formula[3]].outputRealPart() + variable[formula[3]].outputImaginaryPart() * variable[formula[3]].outputImaginaryPart()));
                variable[selector].inputImaginaryPart((variable[formula[3]].outputRealPart() * variable[formula[2]].outputImaginaryPart()  - variable[formula[2]].outputRealPart() * variable[formula[3]].outputImaginaryPart()) / (variable[formula[3]].outputRealPart() * variable[formula[3]].outputRealPart() + variable[formula[3]].outputImaginaryPart() * variable[formula[3]].outputImaginaryPart()));
            break;
        }
    }
    
}

function resetCanvas() {
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    fillStyle = "#333";
    ctx.lineWidth = 1;
    ctx.moveTo(0,canvas.height*0.5);
    ctx.lineTo(canvas.width,canvas.height*0.5);
    ctx.moveTo(canvas.width*0.5,0);
    ctx.lineTo(canvas.width*0.5,canvas.height);
    ctx.stroke();
}

function reloadCanvas() {
    resetCanvas();
    var count = 0;
    while(count < pointCount) {
        compute(count);
        variable[count].drawPoint();
        count ++;
    }
}

window.onload = function(){
    resetCanvas();
    const MainUI = new mainUI();
}