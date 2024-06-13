import { useEffect, useState, useRef } from "react";

/*
  This function takes in obj to be resolved and opts (the properties to resolve).
  opts is key-value pair.
  opts key will become the keys for resolved object.
  opts value will be the path(in string format) that has to be resolved.

  Example:
    const o = { a: { name: { first: "kim", last: "possible" } }, b: 1 };
    opts = {firstname: "a.name['first']"}
    Basically, value will be o.a.name['first'] === 'kim'
    resolvedObj = {firstName: 'kim'}
  
  Necessity:
    We don't want to cache whole json response.
    Only the fields that are required by our app.
    opts will create a user-defined fieldname and resolve its value from original response.
  
  Please suggest a better function name. :)
 */
function resolvePathToObj(obj, opts) {
  const resolvedObj = {};
  for (let [k, v] of Object.entries(opts)) {
    let val = obj;
    const dotSeparated = v.split(".");

    for (let part of dotSeparated) {
      if (!part.includes("[")) {
        val = val[part];
      } else {
        let lidx,
          sidx = 0,
          first = true;
        while ((lidx = part.indexOf("[", sidx)) !== -1) {
          if (first) {
            val = val[part.slice(sidx, lidx)];
            first = false;
          } else {
            val = val[part.slice(sidx + 1, lidx - 2)];
          }
          sidx = lidx + 1;
        }
        val = val[part.slice(sidx + 1, lidx - 1)];
      }
    }
    resolvedObj[k] = val;
  }
  return resolvedObj;
}

export default function useQuery(initialURL, opts) {
  const [data, setData] = useState(null);
  const cache = useRef(new Map()).current;
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetcher(initialURL);
  }, []);

  async function fetcher(url) {
    if (cache.has(url)) {
      console.log("Cache hit");
      if (err) setErr(null);
      setData(cache.get(url));
      return;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Not Found!");
      }
      const json = await response.json();
      const cachedObj = resolvePathToObj(json, opts);
      if (err) setErr(null);
      setData(cachedObj);
      cache.set(url, cachedObj);
    } catch (e) {
      setErr(e);
      setData(null);
    }
  }
  return [data, err, fetcher];
}
