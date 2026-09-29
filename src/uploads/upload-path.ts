import {isAbsolute, join, normalize} from 'path';

export function resolveUploadDirectory(configuredPath = 'uploads', workingDirectory = process.cwd()) {
  return normalize(isAbsolute(configuredPath) ? configuredPath : join(workingDirectory, configuredPath));
}
