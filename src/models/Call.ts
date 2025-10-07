// import { type Disposable } from 'tsyringe';
// import { expectNever } from '../utils/expect';

/*
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.roomService.sendStream(stream, this.peerId);
*/

interface CallStream {
  stream: MediaStream;

  audioEnabled: boolean;
}

interface IncomingCallStream extends CallStream {
  readonly videoEnabled: boolean;
}

interface OutgoingCallStream extends CallStream {
  videoEnabled: boolean;
}

export interface Call {
	incomingStream?: IncomingCallStream;

  outgoingStream?: OutgoingCallStream;

  end(): void;
}

// interface CallStreamController extends Disposable {
// 	stream: MediaStream;

// 	videoEnabled: boolean;

// 	audioEnabled: boolean;
// }

// type StreamStatus = { type: 'initial' } | { type: 'active', stream: MediaStream } | { type: 'broken', error: Error };

// class CallStreamControllerImpl implements CallStreamController {
// 	#status: StreamStatus = { type: 'initial' };

// 	constructor(private video: boolean, private audio: boolean) {
// 		navigator.mediaDevices.getUserMedia({ audio, video })
// 			.then(stream => {
// 				this.#status = { type: 'active', stream };
// 			}, error => {
// 				this.#status = { type: 'broken', error };
// 			});
// 	}

// 	get stream() {
// 		switch (this.#status.type) {
// 			case 'initial':
// 				throw new Error('The stream is not ready yet!');

// 			case 'broken':
// 				throw this.#status.error;

// 			case 'active':
// 				return this.#status.stream;

// 			default:
// 				return expectNever(this.#status);
// 		}
// 	}

// 	get videoEnabled() {
// 		return this.video;
// 	}

// 	set videoEnabled(value: boolean) {
// 		if (this.#status.type !== 'active' || value === this.video) return;

// 		if (!value) {
// 			const tracks = this.#status.stream.getVideoTracks();
// 			for(const track of tracks) {
// 				track.stop();
// 				this.#status.stream.removeTrack(track);
// 			}
// 			this.video = false;
// 			return;
// 		}

// 		navigator.mediaDevices.getUserMedia({ video: true })
// 			.then(stream => {
// 				if (this.#status.type !== 'active') return;

// 				const track = stream.getVideoTracks()[0];

// 				if (!track) return;

// 				this.#status.stream.addTrack(track);
// 				this.video = true;
// 			});
// 	}

// 	get audioEnabled() {
// 		return this.audio;
// 	}

// 	set audioEnabled(value: boolean) {
// 		if (this.#status.type !== 'active' || value === this.audio) return;

// 		if (!value) {
// 			const tracks = this.#status.stream.getAudioTracks();
// 			for(const track of tracks) {
// 				track.stop();
// 				this.#status.stream.removeTrack(track);
// 			}
// 			this.audio = false;
// 			return;
// 		}

// 		navigator.mediaDevices.getUserMedia({ audio: true })
// 			.then(stream => {
// 				if (this.#status.type !== 'active') return;

// 				const track = stream.getAudioTracks()[0];

// 				if (!track) return;

// 				this.#status.stream.addTrack(track);
// 				this.audio = true;
// 			});
// 	}

// 	dispose() {
// 		if (this.#status.type !== 'active') return;

// 		for(const track of this.#status.stream.getTracks()) {
// 			track.stop();
// 		}
// 	}
// }