import SparkMD5 from 'spark-md5'

export function changeBuffer(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = (e) => {
      const BUFFER = e.target?.result

      if (!BUFFER) reject()
      const HASH = new SparkMD5.ArrayBuffer().append(BUFFER as ArrayBuffer).end()
      const suffix = (/\.([a-zA-Z0-9]+)$/.exec(file.name) as any)[1]
      resolve({
        BUFFER,
        HASH,
        suffix
      })
    }
  })
}