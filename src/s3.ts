import {
  GetObjectCommandInput,
  S3ClientConfig,
  S3,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { Readable, Transform, Writable } from "stream";

// client usage:
// s3.reader().pipe(s3.writer())

function reader(config: S3ClientConfig & GetObjectCommandInput): Readable {
  let ts = new Transform({
    transform(chunk, _, callback) {
      callback(null, chunk);
    },
  });
  let client = new S3(config);
  client.getObject(config).then((response) => {
    if (response.Body instanceof Readable) {
      response.Body.pipe(ts);
    }
  });
  return ts;
}

function writer(
  config: S3ClientConfig & Omit<PutObjectCommandInput, "Body">
): Writable {
  let ts = new Transform({
    transform(chunk, _, callback) {
      callback(null, chunk);
    },
  });
  let client = new S3(config);

  client.putObject({
    ...config,
    ...{
      Body: ts,
    },
  });
  return ts;
}

export default { reader, writer };
export { reader, writer };
