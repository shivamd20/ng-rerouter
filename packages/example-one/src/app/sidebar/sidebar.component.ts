import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Route, Router } from '@angular/router';

/** File node data with possible child nodes. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

/**
 * Flattened tree node that has been created from a FileNode through the flattener. Flattened
 * nodes include level index and whether they can be expanded or not.
 */
export interface FlatTreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'ng-rerouter-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<FlatTreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, FlatTreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, FlatTreeNode>;

  constructor(private router: Router) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);

    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    const nodes: FileNode[] =     this.urlTree(this.router.config)
    ;
    this.dataSource.data = nodes;




  }

  urlTree(config: Route[]): FileNode[]{
  const obj: Obj =  config.reduce((acc, conf) => {
      conf.path?.split("/").reduce((previousValue, curVal, index, arr) => {
        previousValue.children[curVal] = previousValue['children'][curVal] ?? {
          name: index + curVal,
          type: 'folder',
          children: {}
        };
        if(index === arr.length -1){
          previousValue['children'][curVal].type = 'file';
        }
        return previousValue['children'][curVal];
      }, acc);
      return acc;
    }, {
      name: '',
      type: 'folder',
    children: {}
    } as Obj);

     return this.objToFileNode(obj).children ?? [];
  }

  objToFileNode(obj: Obj): FileNode{

    if(!obj) return obj;

    const node: FileNode = {name: obj.name, type: obj.type};
    node.children = Object.values(obj.children).map(this.objToFileNode, this);
    return node;
  }




  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number): FlatTreeNode {
    return {
      name: node.name,
      type: node.type,
      level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: FlatTreeNode): number {
    return node.level;
  }

  /** Get whether the node is expanded or not. */
  isExpandable(node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: FlatTreeNode): boolean {
    return node.expandable;
  }

  /** Get the children for the node. */
  getChildren(node: FileNode): FileNode[] | null | undefined {
    return node.children;
  }
}


type Obj = {
  name: string,
  type : 'folder' | 'file'
  children: Record<string,Obj>
}
