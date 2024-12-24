import { parseLines } from "../util/input";
import { Solution } from "../util/types";

/* helper function to find all paths from one pc to another of a given length.
 * just a bfs keeping track of paths
 */
const findUniquePaths = (
  graph: Map<string,Set<string>>,
  start: string,
  finish: string,
  length: number,
) => {
  const paths: string[][] = [];
  const queue: string[][] = [[start]];

  while (queue.length) {
    // we're tracking whole paths, so pop the top path and get the last point
    const currPath = queue.shift() as string[];
    // if the path is bigger than we want, move on
    if (currPath.length > length) continue;
    const curr = currPath[currPath.length - 1];

    // if the last point is our finish and the path is the right length,
    // add it to the list of paths and move on
    if (curr === finish) {
      if (currPath.length === length) {
        paths.push(currPath);
      }
      continue;
    }

    graph.get(curr)!.forEach(adj => {
      if (!currPath.find(point => point === adj)) {
        const newPath = [...currPath, adj];
        queue.push(newPath);
      }
    });
  }

  return paths;
};

/* helper to find all groups within the list of pcs. using bron-kerbosch which
 * i hadn't come across before this, so new knowledge acquired!
 */
const findGroups = (
  graph: Map<string,Set<string>>,
  current: Set<string>,
  next: Set<string>,
  visited: Set<string>,
) => {
  let groups = new Set<Set<string>>();
  if (next.size === 0 && visited.size === 0) {
    groups.add(current);
  }

  for (let pc of next) {
    const newGroup = new Set<string>(current);
    newGroup.add(pc);
    const newNext = new Set<string>([...next].filter(npc => graph.get(pc)!.has(npc)));
    const newVisited = new Set<string>([...visited].filter(vpc => graph.get(pc)!.has(vpc)));
    groups = new Set<Set<string>>([...groups, ...findGroups(graph, newGroup, newNext, newVisited)]);
    next.delete(pc);
    visited.add(pc);
  }

  return groups;
};

export const solve: Solution = {
  part1: (input: string) => {
    const connections = parseLines(input);

    // building an adjacency list for all the pcs
    const connByPc = new Map<string,Set<string>>();
    connections.forEach(conn => {
      const [pc1, pc2] = conn.split('-');

      let pc1conns = new Set<string>();
      if (connByPc.has(pc1)) {
        pc1conns = connByPc.get(pc1)!;
      }
      pc1conns.add(pc2);
      connByPc.set(pc1, pc1conns);

      let pc2conns = new Set<string>();
      if (connByPc.has(pc2)) {
        pc2conns = connByPc.get(pc2)!;
      }
      pc2conns.add(pc1);
      connByPc.set(pc2, pc2conns);
    });

    // here i find all paths from each pc to others of length 3
    const groups: string[] = [];
    const pcList = Array.from(connByPc.keys());
    for (let i = 0; i < pcList.length - 1; i++) {
      const pc = pcList[i];
      pcList.slice(i + 1).forEach(connPc => {
        /* if the start and end pc aren't connected, there isn't a valid group.
         * we don't have to check the middle pc, because since it's groups of 
         * 3, it has to be connected to both
         */
        if (!connByPc.get(pc)?.has(connPc)) return;
        let paths = findUniquePaths(connByPc, pc, connPc, 3);
        paths.forEach(path => {
          const [pc1, pc2, pc3] = path;
          // making sure we don't add variations of the same path
          if (
            groups.indexOf(`${pc1},${pc2},${pc3}`) < 0 &&
            groups.indexOf(`${pc1},${pc3},${pc2}`) < 0 &&
            groups.indexOf(`${pc2},${pc1},${pc3}`) < 0 &&
            groups.indexOf(`${pc2},${pc3},${pc1}`) < 0 &&
            groups.indexOf(`${pc3},${pc1},${pc2}`) < 0 &&
            groups.indexOf(`${pc3},${pc2},${pc1}`) < 0
          ) {
            groups.push(path.join(','));
          }
        });
      });
    }

    // only groups with t pcs!
    const groupsWithT = groups.filter(group => {
      return group.split(',').some(pc => pc.startsWith('t'));
    });

    return groupsWithT.length;
  },

  part2: (input: string) => {
    const connections = parseLines(input);

    const connByPc = new Map<string,Set<string>>();
    connections.forEach(conn => {
      const [pc1, pc2] = conn.split('-');

      let pc1conns = new Set<string>();
      if (connByPc.has(pc1)) {
        pc1conns = connByPc.get(pc1)!;
      }
      pc1conns.add(pc2);
      connByPc.set(pc1, pc1conns);

      let pc2conns = new Set<string>();
      if (connByPc.has(pc2)) {
        pc2conns = connByPc.get(pc2)!;
      }
      pc2conns.add(pc1);
      connByPc.set(pc2, pc2conns);
    });

    // similar setup to part1, only using the bron-kerbosch helper instead
    const allGroups = findGroups(
      connByPc,
      new Set<string>(),
      new Set<string>(connByPc.keys()),
      new Set<string>()
    );
    let maxGroup = new Set<string>();
    allGroups.forEach(group => {
      if (group.size > maxGroup.size) {
        maxGroup = group;
      }
    });

    const groupArray = Array.from(maxGroup);
    groupArray.sort();

    return groupArray.join(',');
  }
};
