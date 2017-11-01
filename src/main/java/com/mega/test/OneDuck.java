package com.mega.test;

/**
 * Created by Administrator on 2017/11/1.
 */
public class OneDuck extends Duck{

    @Override
    public void call() {
//        super.call();
        System.out.println(222222222);
    }

    @Override
    public   void display() {
        System.out.println("red");
    }

    public static void main(String[] args) {
        OneDuck duck=new OneDuck();
        duck.display();
        duck.call();
        duck.swim();
        System.out.println(21);
    }
}
