// src/skeleton.ts
import { Pose } from '@tensorflow-models/pose-detection';
import { Keypoint } from '@tensorflow-models/posenet';


export class Skeleton {
    constructor(private ctx: CanvasRenderingContext2D) {}

    private drawLine(start: Keypoint, end: Keypoint){
        if( !start || !end ) return
        this.ctx.strokeStyle = 'black'
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();
    }

    private drawPoint(point: Keypoint, width: number=5){
        if( !point) return;

        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, width, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, width-1, 0, 2 * Math.PI);
        this.ctx.fill();
}

    public draw(pose: Pose) {
        //console.log(pose)
        const leftEye = pose.keypoints.find((keypoint) => keypoint.name === 'left_eye');
        const rightEye = pose.keypoints.find((keypoint) => keypoint.name == 'right_eye');
        const nose = pose.keypoints.find((keypoint) => keypoint.name === 'nose');

        this.drawPoint(leftEye)
        this.drawPoint(rightEye)
        this.drawPoint(nose, 8)

        const leftEar = pose.keypoints.find((keypoint) => keypoint.name === 'left_ear');
        leftEar.x += 12;
        const rightEar = pose.keypoints.find((keypoint) => keypoint.name === 'right_ear');
        rightEar.x -= 12;
        this.drawPoint(leftEar)
        this.drawPoint(rightEar)

        const leftMouth = pose.keypoints.find((keypoint) => keypoint.name === 'mouth_left');
        const rightMouth = pose.keypoints.find((keypoint) => keypoint.name === 'mouth_right');

        this.drawLine(leftMouth, rightMouth)
        this.drawPoint(leftMouth);
        this.drawPoint(rightMouth);

        const leftShoulder = pose.keypoints.find((keypoint) => keypoint.name === 'left_shoulder');
        const rightShoulder = pose.keypoints.find((keypoint) => keypoint.name === 'right_shoulder');

        this.drawLine(leftShoulder, rightShoulder)
        this.drawPoint(leftShoulder);
        this.drawPoint(rightShoulder);

        const leftElbow = pose.keypoints.find((keypoint) => keypoint.name === 'left_elbow');
        this.drawLine(leftShoulder, leftElbow)
        this.drawPoint(leftElbow);

        const rightElbow = pose.keypoints.find((keypoint) => keypoint.name === 'right_elbow');
        this.drawLine(rightShoulder, rightElbow)
        this.drawPoint(rightElbow);

        const leftWrist = pose.keypoints.find((keypoint) => keypoint.name === 'left_wrist');
        this.drawLine(leftElbow, leftWrist)
        this.drawPoint(leftWrist);

        const rightWrist = pose.keypoints.find((keypoint) => keypoint.name === 'right_wrist');
        this.drawLine(rightElbow, rightWrist)
        this.drawPoint(rightWrist);


        const leftPinky = pose.keypoints.find((keypoint) => keypoint.name === 'left_pinky');
        this.drawLine(leftWrist, leftPinky)
        this.drawPoint(leftPinky);

        const rightPinky = pose.keypoints.find((keypoint) => keypoint.name === 'right_pinky');
        this.drawLine(rightWrist, rightPinky)
        this.drawPoint(rightPinky);

        const leftIndex = pose.keypoints.find((keypoint) => keypoint.name === 'left_index');
        this.drawLine(leftWrist, leftIndex)
        this.drawPoint(leftIndex);

        const rightIndex = pose.keypoints.find((keypoint) => keypoint.name === 'right_index');
        this.drawLine(rightWrist, rightIndex)
        this.drawPoint(rightIndex);

        const leftThumb = pose.keypoints.find((keypoint) => keypoint.name === 'left_thumb');
        this.drawLine(leftWrist, leftThumb)
        this.drawPoint(leftThumb);

        const rightThumb = pose.keypoints.find((keypoint) => keypoint.name === 'right_thumb');
        this.drawLine(rightWrist, rightThumb)
        this.drawPoint(rightThumb);


        const leftHip = pose.keypoints.find((keypoint) => keypoint.name === 'left_hip');
        this.drawLine(leftShoulder, leftHip)
        this.drawPoint(leftHip);

        const rightHip = pose.keypoints.find((keypoint) => keypoint.name === 'right_hip');
        this.drawLine(rightShoulder, rightHip)
        this.drawPoint(rightHip);

        this.drawLine(leftHip, rightHip)



        const leftKnee = pose.keypoints.find((keypoint) => keypoint.name === 'left_knee');
        this.drawLine(leftHip, leftKnee)
        this.drawPoint(leftKnee);

        const rightKnee = pose.keypoints.find((keypoint) => keypoint.name === 'right_knee');
        this.drawLine(rightHip, rightKnee)
        this.drawPoint(rightKnee);


        const leftAnkle = pose.keypoints.find((keypoint) => keypoint.name === 'left_ankle');
        this.drawLine(leftKnee, leftAnkle)
        this.drawPoint(leftAnkle);

        const rightAnkle = pose.keypoints.find((keypoint) => keypoint.name === 'right_ankle');
        this.drawLine(rightKnee, rightAnkle)
        this.drawPoint(rightAnkle);

        const leftHeel = pose.keypoints.find((keypoint) => keypoint.name === 'left_heel');
        this.drawLine(leftAnkle, leftHeel)
        this.drawPoint(leftHeel);

        const rightHeel = pose.keypoints.find((keypoint) => keypoint.name === 'right_heel');
        this.drawLine(rightAnkle, rightHeel)
        this.drawPoint(rightHeel);

        const leftFoot = pose.keypoints.find((keypoint) => keypoint.name === 'left_foot_index');
        this.drawLine(leftHeel, leftFoot)
        this.drawPoint(leftFoot);

        const rightFoot = pose.keypoints.find((keypoint) => keypoint.name === 'right_foot_index');
        this.drawLine(rightHeel, rightFoot)
        this.drawPoint(rightFoot);
        // if( leftEar ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(leftEar.x, leftEar.y-10);
        //     this.ctx.lineTo(leftEar.x, leftEar.y+20);
        //     this.ctx.stroke();
        // }
        // if( rightEar ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(rightEar.x, rightEar.y-10);
        //     this.ctx.lineTo(rightEar.x, rightEar.y+20);
        //     this.ctx.stroke();
        // }

        // const leftAnkle = pose.keypoints.find((keypoint) => keypoint.name === 'left_ankle');
        // const rightAnkle = pose.keypoints.find((keypoint) => keypoint.name === 'right_ankle');
        // if( leftAnkle ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(leftAnkle.x, leftAnkle.y-10);
        //     this.ctx.lineTo(leftAnkle.x, leftAnkle.y+20);
        //     this.ctx.stroke();
        // }
        // if( rightAnkle ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(rightAnkle.x, rightAnkle.y-10);
        //     this.ctx.lineTo(rightAnkle.x, rightAnkle.y+20);
        //     this.ctx.stroke();
        // }
        
        // if( leftElbow ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(leftElbow.x, leftElbow.y-10);
        //     this.ctx.lineTo(leftElbow.x, leftElbow.y+20);
        //     this.ctx.stroke();
        // }
        // if( rightElbow ) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(rightElbow.x, rightElbow.y-10);
        //     this.ctx.lineTo(rightElbow.x, rightElbow.y+20);
        //     this.ctx.stroke();
        // }       
        //this.ctx.canvas.width  = window.innerWidth;
        //this.ctx.canvas.height = window.innerHeight;           
    }

}