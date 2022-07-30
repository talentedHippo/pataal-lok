// src/skeleton.ts
import { Pose } from '@tensorflow-models/pose-detection';

export class Skeleton {
    constructor(private ctx: CanvasRenderingContext2D) {}

    private drawHead(pose: Pose) {
        const leftEye = pose.keypoints.find((keypoint) => keypoint.name === 'left_eye');
        const rightEye = pose.keypoints.find((keypoint) => keypoint.name == 'right_eye');
        const leftMouth = pose.keypoints.find((keypoint) => keypoint.name === 'mouth_left');
        const rightMouth = pose.keypoints.find((keypoint) => keypoint.name === 'mouth_right');
        const nose = pose.keypoints.find((keypoint) => keypoint.name === 'nose');
        const leftIndex = pose.keypoints.find((keypoint) => keypoint.name === 'left_index');
        const rightIndex = pose.keypoints.find((keypoint) => keypoint.name === 'right_index');
        const leftShoulder = pose.keypoints.find((keypoint) => keypoint.name === 'left_shoulder');
        const rightShoulder = pose.keypoints.find((keypoint) => keypoint.name === 'right_shoulder');

        
        this.ctx.fillStyle = 'red';
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 5;
        //this.ctx.scale(.20,.20) 
        if (leftEye) {
            this.ctx.beginPath();
            this.ctx.arc(leftEye.x - 10, leftEye.y - 10, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        if (rightEye) {
            this.ctx.beginPath();
            this.ctx.arc(rightEye.x - 10, rightEye.y - 10, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        if (nose) {
            this.ctx.beginPath();
            this.ctx.arc(nose.x - 10, nose.y - 10, 10, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        if (leftMouth && rightMouth) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftMouth.x, leftMouth.y);
            this.ctx.lineTo(rightMouth.x, rightMouth.y);
            this.ctx.stroke();
        }
        if (leftIndex) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftIndex.x, leftIndex.y);
            this.ctx.lineTo(leftIndex.x+20, leftIndex.y+20);
            this.ctx.stroke();
        }
        if (rightIndex) {
            this.ctx.beginPath();
            this.ctx.moveTo(rightIndex.x, rightIndex.y);
            this.ctx.lineTo(rightIndex.x+20, rightIndex.y+20);
            this.ctx.stroke();
        }
        if (leftShoulder && rightShoulder) {
            this.ctx.beginPath();
            this.ctx.moveTo(leftShoulder.x+10, leftShoulder.y);
            this.ctx.lineTo(rightShoulder.x-10, rightShoulder.y);
            this.ctx.stroke();
        }
    }

    public draw(pose: Pose) {
        this.drawHead(pose);
    }
}